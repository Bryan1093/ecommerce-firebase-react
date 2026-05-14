import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AdminLayout from '../components/admin/AdminLayout'
import ToastStack from '../components/ui/ToastStack'
import { usePreferences } from '../context/PreferencesContext'
import { DEFAULT_IMAGE_PLACEHOLDER, sanitizeImageUrl } from '../utils/sanitizeImageUrl'

const DRAFT_STORAGE_KEY = 'newProductDraftV1'

const initialForm = {
  name: '',
  category: 'Electrónica',
  brand: '',
  sku: '',
  price: '',
  stock: '',
  discount: '0',
  tax: '19',
  image: '',
  sizes: '',
  colors: '',
  warrantyMonths: '12',
  tags: '',
}

const brandSuggestions = ['NovaTech', 'SonicOne', 'StreetLab', 'CasaLink', 'NomadGo']
const tagSuggestions = ['audio', 'wearable', 'smart', 'moda', 'hogar', 'fitness', 'viaje']

const parseList = (value) =>
  value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)

const isPositiveNumber = (value) => Number(value) > 0
const isNonNegativeNumber = (value) => Number(value) >= 0

function NewProduct() {
  const navigate = useNavigate()
  const { categoryOptions, formatCurrency, getCategoryLabel, locale, t } = usePreferences()

  const steps = useMemo(
    () => [
      t('newProduct.basicInfo'),
      t('newProduct.pricing'),
      t('newProduct.media'),
      t('newProduct.summary'),
    ],
    [t],
  )

  const [step, setStep] = useState(1)
  const [form, setForm] = useState(() => {
    const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY)
    if (!savedDraft) {
      return initialForm
    }

    try {
      return { ...initialForm, ...JSON.parse(savedDraft) }
    } catch {
      localStorage.removeItem(DRAFT_STORAGE_KEY)
      return initialForm
    }
  })
  const [errors, setErrors] = useState({})
  const [lastSaved, setLastSaved] = useState(null)
  const [toasts, setToasts] = useState([])

  const pushToast = useCallback((message, type = 'info') => {
    setToasts((current) => [...current, { id: Date.now() + Math.random(), message, type }])
  }, [])

  const removeToast = useCallback((toastId) => {
    setToasts((current) => current.filter((toast) => toast.id !== toastId))
  }, [])

  const validateForm = useCallback(
    (candidate) => {
      const validationErrors = {}

      if (!candidate.name.trim()) {
        validationErrors.name = t('newProduct.validation.requiredName')
      }
      if (!candidate.brand.trim()) {
        validationErrors.brand = t('newProduct.validation.requiredBrand')
      }
      if (!candidate.sku.trim()) {
        validationErrors.sku = t('newProduct.validation.requiredSku')
      }
      if (!candidate.category) {
        validationErrors.category = t('newProduct.validation.requiredCategory')
      }

      if (!isPositiveNumber(candidate.price)) {
        validationErrors.price = t('newProduct.validation.positivePrice')
      }
      if (!isNonNegativeNumber(candidate.stock)) {
        validationErrors.stock = t('newProduct.validation.nonNegativeStock')
      }

      const discount = Number(candidate.discount)
      if (Number.isNaN(discount) || discount < 0 || discount > 90) {
        validationErrors.discount = t('newProduct.validation.discountRange')
      }

      const tax = Number(candidate.tax)
      if (Number.isNaN(tax) || tax < 0 || tax > 100) {
        validationErrors.tax = t('newProduct.validation.taxRange')
      }

      if (!candidate.image.trim()) {
        validationErrors.image = t('newProduct.validation.requiredImage')
      }

      if (candidate.category === 'Moda') {
        if (parseList(candidate.sizes).length === 0) {
          validationErrors.sizes = t('newProduct.validation.requiredSizes')
        }
        if (parseList(candidate.colors).length === 0) {
          validationErrors.colors = t('newProduct.validation.requiredColors')
        }
      }

      if (candidate.category === 'Electrónica' && !isPositiveNumber(candidate.warrantyMonths)) {
        validationErrors.warrantyMonths = t('newProduct.validation.warrantyRange')
      }

      if (parseList(candidate.tags).length === 0) {
        validationErrors.tags = t('newProduct.validation.requiredTags')
      }

      return validationErrors
    },
    [t],
  )

  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(form))
      setLastSaved(new Date())
    }, 450)

    return () => clearTimeout(timer)
  }, [form])

  const progress = (step / steps.length) * 100

  const previewPrice = useMemo(() => {
    const numericPrice = Number(form.price)
    return Number.isFinite(numericPrice) && numericPrice > 0 ? numericPrice : 0
  }, [form.price])

  const onFieldChange = (event) => {
    const { name, value } = event.target
    const nextForm = { ...form, [name]: value }
    setForm(nextForm)

    const nextErrors = validateForm(nextForm)
    setErrors(nextErrors)
  }

  const goNextStep = () => {
    const nextErrors = validateForm(form)
    setErrors(nextErrors)

    const stepFields = {
      1: ['name', 'category', 'brand', 'sku'],
      2: ['price', 'stock', 'discount', 'tax'],
      3: ['image', 'sizes', 'colors', 'warrantyMonths', 'tags'],
      4: [],
    }

    const hasStepErrors = stepFields[step].some((field) => nextErrors[field])
    if (hasStepErrors) {
      pushToast(t('newProduct.stepErrorToast'), 'error')
      return
    }

    setStep((current) => Math.min(current + 1, steps.length))
  }

  const goPreviousStep = () => {
    setStep((current) => Math.max(current - 1, 1))
  }

  const saveDraft = () => {
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(form))
    setLastSaved(new Date())
    pushToast(t('newProduct.manualSaveToast'), 'success')
  }

  const publishProduct = (event) => {
    event.preventDefault()

    const nextErrors = validateForm(form)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      pushToast(t('newProduct.submitErrorToast'), 'error')
      return
    }

    const productPayload = {
      id: Date.now(),
      name: form.name.trim(),
      category: form.category,
      brand: form.brand.trim(),
      sku: form.sku.trim(),
      price: Number(form.price),
      stock: Number(form.stock),
      discount: Number(form.discount),
      tax: Number(form.tax),
      rating: 5,
      status: Number(form.stock) === 0 ? 'out_of_stock' : 'published',
      image: sanitizeImageUrl(form.image, DEFAULT_IMAGE_PLACEHOLDER),
      variants: {
        sizes: parseList(form.sizes),
        colors: parseList(form.colors),
        warrantyMonths: Number(form.warrantyMonths) || 0,
      },
      tags: parseList(form.tags),
      updatedBy: 'Bryan',
      updatedAt: new Date().toISOString(),
      history: [t('newProduct.createdHistory')],
    }

    localStorage.removeItem(DRAFT_STORAGE_KEY)
    navigate('/productos', { state: { newProduct: productPayload, created: true } })
  }

  return (
    <>
      <AdminLayout
        eyebrow={t('newProduct.eyebrow')}
        title={t('newProduct.title')}
        breadcrumbs={[t('newProduct.breadcrumbs.panel'), t('newProduct.breadcrumbs.products'), t('newProduct.breadcrumbs.newProduct')]}
        actions={
          <>
            <button className="btn btn-ghost" type="button" onClick={saveDraft}>
              {t('newProduct.saveDraft')}
            </button>
            <Link className="btn btn-ghost" to="/productos">
              {t('newProduct.backToCatalog')}
            </Link>
          </>
        }
      >
        <section className="wizard-card">
          <header className="wizard-header">
            <div>
              <h3>{t('newProduct.stepLabel', { step, total: steps.length, title: steps[step - 1] })}</h3>
              <p>
                {t('newProduct.marketplaceQuality')}
                {lastSaved
                  ? ` ${t('newProduct.draftSavedAt', { time: lastSaved.toLocaleTimeString(locale) })}`
                  : ''}
              </p>
            </div>
            <strong>{Math.round(progress)}%</strong>
          </header>

          <div className="wizard-progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow={progress}>
            <span style={{ width: `${progress}%` }} />
          </div>

          <form className="wizard-form" onSubmit={publishProduct}>
            {step === 1 && (
              <section className="wizard-fields">
                <label>
                  {t('newProduct.productName')}
                  <input
                    name="name"
                    value={form.name}
                    onChange={onFieldChange}
                    placeholder={t('newProduct.productNamePlaceholder')}
                  />
                  {errors.name ? <small className="field-error">{errors.name}</small> : null}
                </label>

                <label>
                  {t('newProduct.category')}
                  <select name="category" value={form.category} onChange={onFieldChange}>
                    {categoryOptions.map((category) => (
                      <option key={category.value} value={category.value}>
                        {t(category.key)}
                      </option>
                    ))}
                  </select>
                  {errors.category ? <small className="field-error">{errors.category}</small> : null}
                </label>

                <label>
                  {t('newProduct.brand')}
                  <input
                    name="brand"
                    value={form.brand}
                    onChange={onFieldChange}
                    list="brand-suggestions"
                    placeholder={t('newProduct.brandPlaceholder')}
                  />
                  <datalist id="brand-suggestions">
                    {brandSuggestions.map((brand) => (
                      <option key={brand} value={brand} />
                    ))}
                  </datalist>
                  {errors.brand ? <small className="field-error">{errors.brand}</small> : null}
                </label>

                <label>
                  {t('newProduct.sku')}
                  <input
                    name="sku"
                    value={form.sku}
                    onChange={onFieldChange}
                    placeholder={t('newProduct.skuPlaceholder')}
                  />
                  {errors.sku ? <small className="field-error">{errors.sku}</small> : null}
                </label>
              </section>
            )}

            {step === 2 && (
              <section className="wizard-fields">
                <label>
                  {t('newProduct.price')}
                  <input name="price" type="number" min="0" value={form.price} onChange={onFieldChange} />
                  {errors.price ? <small className="field-error">{errors.price}</small> : null}
                </label>

                <label>
                  {t('newProduct.stock')}
                  <input name="stock" type="number" min="0" value={form.stock} onChange={onFieldChange} />
                  {errors.stock ? <small className="field-error">{errors.stock}</small> : null}
                </label>

                <label>
                  {t('newProduct.discount')}
                  <input name="discount" type="number" min="0" max="90" value={form.discount} onChange={onFieldChange} />
                  {errors.discount ? <small className="field-error">{errors.discount}</small> : null}
                </label>

                <label>
                  {t('newProduct.tax')}
                  <input name="tax" type="number" min="0" max="100" value={form.tax} onChange={onFieldChange} />
                  {errors.tax ? <small className="field-error">{errors.tax}</small> : null}
                </label>
              </section>
            )}

            {step === 3 && (
              <section className="wizard-fields">
                <label>
                  {t('newProduct.imageUrl')}
                  <input
                    name="image"
                    type="url"
                    value={form.image}
                    onChange={onFieldChange}
                    placeholder={t('newProduct.imagePlaceholder')}
                  />
                  {errors.image ? <small className="field-error">{errors.image}</small> : null}
                </label>

                {form.category === 'Moda' ? (
                  <>
                    <label>
                      {t('newProduct.sizes')}
                      <input
                        name="sizes"
                        value={form.sizes}
                        onChange={onFieldChange}
                        placeholder={t('newProduct.sizesPlaceholder')}
                      />
                      {errors.sizes ? <small className="field-error">{errors.sizes}</small> : null}
                    </label>
                    <label>
                      {t('newProduct.colors')}
                      <input
                        name="colors"
                        value={form.colors}
                        onChange={onFieldChange}
                        placeholder={t('newProduct.colorsPlaceholder')}
                      />
                      {errors.colors ? <small className="field-error">{errors.colors}</small> : null}
                    </label>
                  </>
                ) : (
                  <label>
                    {t('newProduct.warrantyMonths')}
                    <input
                      name="warrantyMonths"
                      type="number"
                      min="0"
                      value={form.warrantyMonths}
                      onChange={onFieldChange}
                    />
                    {errors.warrantyMonths ? <small className="field-error">{errors.warrantyMonths}</small> : null}
                  </label>
                )}

                <label>
                  {t('newProduct.tags')}
                  <input
                    name="tags"
                    value={form.tags}
                    onChange={onFieldChange}
                    list="tag-suggestions"
                    placeholder={t('newProduct.tagsPlaceholder')}
                  />
                  <datalist id="tag-suggestions">
                    {tagSuggestions.map((tag) => (
                      <option key={tag} value={tag} />
                    ))}
                  </datalist>
                  {errors.tags ? <small className="field-error">{errors.tags}</small> : null}
                </label>
              </section>
            )}

            {step === 4 && (
              <section className="wizard-summary">
                <article className="summary-card">
                  <h4>{t('newProduct.summaryTitle')}</h4>
                  <ul>
                    <li>
                      <strong>{t('newProduct.productName')}:</strong> {form.name}
                    </li>
                    <li>
                      <strong>{t('newProduct.category')}:</strong> {getCategoryLabel(form.category)}
                    </li>
                    <li>
                      <strong>{t('newProduct.brand')}:</strong> {form.brand}
                    </li>
                    <li>
                      <strong>{t('newProduct.sku')}:</strong> {form.sku}
                    </li>
                    <li>
                      <strong>{t('newProduct.price')}:</strong> {formatCurrency(previewPrice)}
                    </li>
                    <li>
                      <strong>{t('newProduct.stock')}:</strong> {form.stock}
                    </li>
                    <li>
                      <strong>{t('newProduct.tags')}:</strong> {parseList(form.tags).join(', ') || '-'}
                    </li>
                  </ul>
                </article>

                <article className="preview-card">
                  <p className="item-category">{t('newProduct.previewTitle')}</p>
                  <img
                    src={sanitizeImageUrl(
                      form.image,
                      'https://placehold.co/600x400/eef2ff/1f2937?text=Imagen+producto',
                    )}
                    alt={t('newProduct.previewAlt')}
                    className="catalog-image"
                  />
                  <h4>{form.name || t('newProduct.productName')}</h4>
                  <p className="item-meta">
                    {form.brand || t('newProduct.brand')} · {getCategoryLabel(form.category)}
                  </p>
                  <strong>{formatCurrency(previewPrice)}</strong>
                </article>
              </section>
            )}

            <footer className="wizard-footer">
              <button type="button" className="btn btn-ghost" disabled={step === 1} onClick={goPreviousStep}>
                {t('common.previous')}
              </button>

              {step < steps.length ? (
                <button type="button" className="btn btn-primary" onClick={goNextStep}>
                  {t('newProduct.continue')}
                </button>
              ) : (
                <button type="submit" className="btn btn-primary">
                  {t('newProduct.publish')}
                </button>
              )}
            </footer>
          </form>
        </section>
      </AdminLayout>

      <ToastStack toasts={toasts} onDismiss={removeToast} />
    </>
  )
}

export default NewProduct
