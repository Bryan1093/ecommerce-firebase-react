import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AdminLayout from '../components/admin/AdminLayout'
import ToastStack from '../components/ui/ToastStack'

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

const steps = [
  'Información básica',
  'Precio y stock',
  'Imágenes y variantes',
  'Resumen y publicación',
]

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

  const validateForm = useCallback((candidate) => {
    const validationErrors = {}

    if (!candidate.name.trim()) {
      validationErrors.name = 'El nombre es obligatorio.'
    }
    if (!candidate.brand.trim()) {
      validationErrors.brand = 'La marca es obligatoria.'
    }
    if (!candidate.sku.trim()) {
      validationErrors.sku = 'El SKU es obligatorio.'
    }
    if (!candidate.category) {
      validationErrors.category = 'Selecciona una categoría.'
    }

    if (!isPositiveNumber(candidate.price)) {
      validationErrors.price = 'El precio debe ser mayor que 0.'
    }
    if (!isNonNegativeNumber(candidate.stock)) {
      validationErrors.stock = 'El stock no puede ser negativo.'
    }

    const discount = Number(candidate.discount)
    if (Number.isNaN(discount) || discount < 0 || discount > 90) {
      validationErrors.discount = 'El descuento debe estar entre 0% y 90%.'
    }

    const tax = Number(candidate.tax)
    if (Number.isNaN(tax) || tax < 0 || tax > 100) {
      validationErrors.tax = 'El impuesto debe estar entre 0% y 100%.'
    }

    if (!candidate.image.trim()) {
      validationErrors.image = 'Agrega una URL de imagen principal.'
    }

    if (candidate.category === 'Moda') {
      if (parseList(candidate.sizes).length === 0) {
        validationErrors.sizes = 'Para moda, define al menos una talla.'
      }
      if (parseList(candidate.colors).length === 0) {
        validationErrors.colors = 'Para moda, define al menos un color.'
      }
    }

    if (candidate.category === 'Electrónica' && !isPositiveNumber(candidate.warrantyMonths)) {
      validationErrors.warrantyMonths = 'Define meses de garantía mayores a 0.'
    }

    if (parseList(candidate.tags).length === 0) {
      validationErrors.tags = 'Añade al menos una etiqueta.'
    }

    return validationErrors
  }, [])

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
      pushToast('Corrige los campos marcados para continuar', 'error')
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
    pushToast('Borrador guardado manualmente', 'success')
  }

  const publishProduct = (event) => {
    event.preventDefault()

    const nextErrors = validateForm(form)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      pushToast('Completa todos los campos obligatorios antes de publicar', 'error')
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
      image: form.image.trim(),
      variants: {
        sizes: parseList(form.sizes),
        colors: parseList(form.colors),
        warrantyMonths: Number(form.warrantyMonths) || 0,
      },
      tags: parseList(form.tags),
      updatedBy: 'Bryan',
      updatedAt: new Date().toISOString(),
      history: ['Producto creado y publicado por Bryan'],
    }

    localStorage.removeItem(DRAFT_STORAGE_KEY)
    navigate('/productos', { state: { newProduct: productPayload, created: true } })
  }

  return (
    <>
      <AdminLayout
        eyebrow="Alta guiada"
        title="Agregar nuevo producto"
        breadcrumbs={['Panel', 'Productos', 'Nuevo producto']}
        actions={
          <>
            <button className="btn btn-ghost" type="button" onClick={saveDraft}>
              Guardar borrador
            </button>
            <Link className="btn btn-ghost" to="/productos">
              Volver al catálogo
            </Link>
          </>
        }
      >
        <section className="wizard-card">
          <header className="wizard-header">
            <div>
              <h3>
                Paso {step} de {steps.length}: {steps[step - 1]}
              </h3>
              <p>
                Completa el flujo para publicar con calidad de marketplace.
                {lastSaved ? ` Borrador guardado: ${lastSaved.toLocaleTimeString('es-CO')}` : ''}
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
                  Nombre del producto
                  <input name="name" value={form.name} onChange={onFieldChange} placeholder="Ej: Smartwatch Pro" />
                  {errors.name ? <small className="field-error">{errors.name}</small> : null}
                </label>

                <label>
                  Categoría
                  <select name="category" value={form.category} onChange={onFieldChange}>
                    <option value="Electrónica">Electrónica</option>
                    <option value="Moda">Moda</option>
                    <option value="Hogar">Hogar</option>
                  </select>
                  {errors.category ? <small className="field-error">{errors.category}</small> : null}
                </label>

                <label>
                  Marca
                  <input
                    name="brand"
                    value={form.brand}
                    onChange={onFieldChange}
                    list="brand-suggestions"
                    placeholder="Ej: NovaTech"
                  />
                  <datalist id="brand-suggestions">
                    {brandSuggestions.map((brand) => (
                      <option key={brand} value={brand} />
                    ))}
                  </datalist>
                  {errors.brand ? <small className="field-error">{errors.brand}</small> : null}
                </label>

                <label>
                  SKU
                  <input name="sku" value={form.sku} onChange={onFieldChange} placeholder="Ej: NVT-SWP-01" />
                  {errors.sku ? <small className="field-error">{errors.sku}</small> : null}
                </label>
              </section>
            )}

            {step === 2 && (
              <section className="wizard-fields">
                <label>
                  Precio
                  <input name="price" type="number" min="0" value={form.price} onChange={onFieldChange} />
                  {errors.price ? <small className="field-error">{errors.price}</small> : null}
                </label>

                <label>
                  Stock
                  <input name="stock" type="number" min="0" value={form.stock} onChange={onFieldChange} />
                  {errors.stock ? <small className="field-error">{errors.stock}</small> : null}
                </label>

                <label>
                  Descuento (%)
                  <input name="discount" type="number" min="0" max="90" value={form.discount} onChange={onFieldChange} />
                  {errors.discount ? <small className="field-error">{errors.discount}</small> : null}
                </label>

                <label>
                  Impuesto (%)
                  <input name="tax" type="number" min="0" max="100" value={form.tax} onChange={onFieldChange} />
                  {errors.tax ? <small className="field-error">{errors.tax}</small> : null}
                </label>
              </section>
            )}

            {step === 3 && (
              <section className="wizard-fields">
                <label>
                  URL imagen principal
                  <input
                    name="image"
                    type="url"
                    value={form.image}
                    onChange={onFieldChange}
                    placeholder="https://..."
                  />
                  {errors.image ? <small className="field-error">{errors.image}</small> : null}
                </label>

                {form.category === 'Moda' ? (
                  <>
                    <label>
                      Tallas (separadas por coma)
                      <input name="sizes" value={form.sizes} onChange={onFieldChange} placeholder="S, M, L" />
                      {errors.sizes ? <small className="field-error">{errors.sizes}</small> : null}
                    </label>
                    <label>
                      Colores (separados por coma)
                      <input name="colors" value={form.colors} onChange={onFieldChange} placeholder="Negro, Azul" />
                      {errors.colors ? <small className="field-error">{errors.colors}</small> : null}
                    </label>
                  </>
                ) : (
                  <label>
                    Garantía en meses
                    <input
                      name="warrantyMonths"
                      type="number"
                      min="0"
                      value={form.warrantyMonths}
                      onChange={onFieldChange}
                    />
                    {errors.warrantyMonths ? (
                      <small className="field-error">{errors.warrantyMonths}</small>
                    ) : null}
                  </label>
                )}

                <label>
                  Etiquetas (separadas por coma)
                  <input
                    name="tags"
                    value={form.tags}
                    onChange={onFieldChange}
                    list="tag-suggestions"
                    placeholder="smart, audio, premium"
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
                  <h4>Resumen final</h4>
                  <ul>
                    <li>
                      <strong>Nombre:</strong> {form.name}
                    </li>
                    <li>
                      <strong>Categoría:</strong> {form.category}
                    </li>
                    <li>
                      <strong>Marca:</strong> {form.brand}
                    </li>
                    <li>
                      <strong>SKU:</strong> {form.sku}
                    </li>
                    <li>
                      <strong>Precio:</strong> ${previewPrice}
                    </li>
                    <li>
                      <strong>Stock:</strong> {form.stock}
                    </li>
                    <li>
                      <strong>Tags:</strong> {parseList(form.tags).join(', ') || '-'}
                    </li>
                  </ul>
                </article>

                <article className="preview-card">
                  <p className="item-category">Vista previa</p>
                  <img
                    src={form.image || 'https://placehold.co/600x400/eef2ff/1f2937?text=Imagen+producto'}
                    alt="Vista previa del producto"
                    className="catalog-image"
                  />
                  <h4>{form.name || 'Nombre del producto'}</h4>
                  <p className="item-meta">{form.brand || 'Marca'} · {form.category}</p>
                  <strong>${previewPrice}</strong>
                </article>
              </section>
            )}

            <footer className="wizard-footer">
              <button type="button" className="btn btn-ghost" disabled={step === 1} onClick={goPreviousStep}>
                Anterior
              </button>

              {step < steps.length ? (
                <button type="button" className="btn btn-primary" onClick={goNextStep}>
                  Continuar
                </button>
              ) : (
                <button type="submit" className="btn btn-primary">
                  Publicar producto
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
