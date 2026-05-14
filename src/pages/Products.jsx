import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import AdminLayout from '../components/admin/AdminLayout'
import ToastStack from '../components/ui/ToastStack'
import { usePreferences } from '../context/PreferencesContext'
import { useStore } from '../context/StoreContext'
import { buildSlug } from '../data/storeSeed'
import { DEFAULT_IMAGE_PLACEHOLDER, sanitizeImageUrl } from '../utils/sanitizeImageUrl'

function Products() {
  const fileInputRef = useRef(null)
  const { formatCurrency, formatDateTime } = usePreferences()
  const { products, duplicateProduct, updateProductStatus, deleteProduct, importProducts, lowStockProducts } = useStore()
  const [search, setSearch] = useState('')
  const [toasts, setToasts] = useState([])

  const pushToast = (message, type = 'info') => {
    setToasts((current) => [...current, { id: Date.now() + Math.random(), message, type }])
  }

  const visibleProducts = products.filter((product) => {
    const normalizedSearch = search.trim().toLowerCase()
    return !normalizedSearch || product.name.toLowerCase().includes(normalizedSearch) || product.sku.toLowerCase().includes(normalizedSearch)
  })

  const importCsvProducts = (event) => {
    const selectedFile = event.target.files?.[0]
    if (!selectedFile) {
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      const csvText = String(reader.result || '')
      const lines = csvText.split('\n').map((line) => line.trim()).filter(Boolean)
      if (lines.length < 2) {
        pushToast('El CSV no contiene filas válidas', 'error')
        return
      }

      const [headerLine, ...rows] = lines
      const headers = headerLine.split(',').map((cell) => cell.trim().toLowerCase())
      const importedProducts = rows
        .map((row) => {
          const values = row.split(',').map((cell) => cell.trim())
          const data = headers.reduce((accumulator, header, index) => {
            accumulator[header] = values[index] || ''
            return accumulator
          }, {})

          if (!data.name || !data.sku) {
            return null
          }

          const stock = Number(data.stock || 0)
          const image = sanitizeImageUrl(data.image, DEFAULT_IMAGE_PLACEHOLDER)
          return {
            id: Date.now() + Math.random(),
            slug: buildSlug(data.name),
            name: data.name,
            category: data.category || 'General',
            subcategory: data.subcategory || 'General',
            brand: data.brand || 'Marca demo',
            sku: data.sku,
            price: Number(data.price || 0),
            compareAtPrice: Number(data.compareatprice || data.price || 0),
            stock,
            reservedStock: 0,
            discount: Number(data.discount || 0),
            tax: Number(data.tax || 19),
            rating: 4.5,
            reviewCount: 0,
            status: stock === 0 ? 'out_of_stock' : 'published',
            featured: false,
            badges: ['Importado'],
            image,
            gallery: [image],
            description: data.description || 'Producto importado desde CSV.',
            highlights: ['Carga masiva'],
            specs: { origen: 'CSV' },
            variants: { colors: [], sizes: [], warrantyMonths: 0 },
            tags: data.tags ? data.tags.split('|').map((tag) => tag.trim()).filter(Boolean) : [],
            sales: 0,
            updatedBy: 'Bryan',
            updatedAt: new Date().toISOString(),
            history: ['Producto importado por CSV'],
            reviews: [],
          }
        })
        .filter(Boolean)

      importProducts(importedProducts)
      pushToast(`Se importaron ${importedProducts.length} productos`, 'success')
    }

    reader.readAsText(selectedFile)
    event.target.value = ''
  }

  return (
    <>
      <AdminLayout
        eyebrow="Catálogo admin"
        title="Gestión de productos"
        breadcrumbs={['Admin', 'Productos']}
        actions={
          <>
            <button className="btn btn-ghost" type="button" onClick={() => fileInputRef.current?.click()}>
              Importar CSV
            </button>
            <Link className="btn btn-primary" to="/admin/productos/nuevo">
              Nuevo producto
            </Link>
            <input ref={fileInputRef} type="file" accept=".csv" className="sr-only-input" onChange={importCsvProducts} />
          </>
        }
      >
        <section className="section-card">
          <div className="catalog-toolbar modern-toolbar">
            <input className="catalog-input" type="search" placeholder="Busca por nombre o SKU" value={search} onChange={(event) => setSearch(event.target.value)} />
            <div className="feature-panel feature-panel-inline">
              <div>
                <strong>Alertas</strong>
                <p>{lowStockProducts.length} productos bajo stock</p>
              </div>
            </div>
          </div>

          <div className="order-list">
            {visibleProducts.map((product) => (
              <article key={product.id} className="catalog-item catalog-item-extended">
                <img src={product.image} alt={product.name} className="catalog-image" loading="lazy" />
                <div>
                  <p className="item-category">{product.category} / {product.subcategory}</p>
                  <h3>{product.name}</h3>
                  <p className="item-meta">{product.brand} · SKU {product.sku}</p>
                  <p className="item-meta">
                    <strong>{formatCurrency(product.price)}</strong> · Stock {product.stock} · Reservado {product.reservedStock}
                  </p>
                  <p className={`status-pill status-${product.status}`}>{product.status}</p>
                  <small className="history-item">Actualizado {formatDateTime(product.updatedAt)} · {product.history?.[0]}</small>
                </div>
                <div className="catalog-actions catalog-actions-column">
                  <button type="button" className="btn btn-ghost" onClick={() => { duplicateProduct(product.id); pushToast('Producto duplicado', 'success') }}>
                    Duplicar
                  </button>
                  <button type="button" className="btn btn-ghost" onClick={() => { updateProductStatus(product.id, 'draft'); pushToast('Producto movido a borrador') }}>
                    Borrador
                  </button>
                  <button type="button" className="btn btn-ghost" onClick={() => { updateProductStatus(product.id, 'published'); pushToast('Producto publicado', 'success') }}>
                    Publicar
                  </button>
                  <button type="button" className="btn btn-ghost" onClick={() => { updateProductStatus(product.id, 'out_of_stock'); pushToast('Producto marcado sin stock') }}>
                    Sin stock
                  </button>
                  <button type="button" className="btn btn-danger" onClick={() => { deleteProduct(product.id); pushToast('Producto eliminado', 'error') }}>
                    Eliminar
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </AdminLayout>
      <ToastStack toasts={toasts} onDismiss={(toastId) => setToasts((current) => current.filter((toast) => toast.id !== toastId))} />
    </>
  )
}

export default Products
