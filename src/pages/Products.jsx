import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import AdminLayout from '../components/admin/AdminLayout'
import ToastStack from '../components/ui/ToastStack'
import { mockProducts, statusLabel } from '../data/mockProducts'

const STORAGE_KEY = 'catalogProductsV1'
const PAGE_SIZE = 4

const formatDate = (dateValue) =>
  new Date(dateValue).toLocaleString('es-CO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

function Products() {
  const location = useLocation()

  const [products, setProducts] = useState(() => {
    const incomingProduct = location.state?.newProduct
    const savedProducts = localStorage.getItem(STORAGE_KEY)
    let parsedProducts = mockProducts

    if (savedProducts) {
      try {
        parsedProducts = JSON.parse(savedProducts)
      } catch {
        parsedProducts = mockProducts
      }
    }

    return incomingProduct ? [incomingProduct, ...parsedProducts] : parsedProducts
  })
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [sortBy, setSortBy] = useState('updated_desc')
  const [page, setPage] = useState(1)
  const [toasts, setToasts] = useState(() =>
    location.state?.created
      ? [{ id: 1, message: 'Producto publicado correctamente', type: 'success' }]
      : [],
  )
  const nextIdRef = useRef(
    (products.reduce((maxId, product) => Math.max(maxId, Number(product.id) || 0), 0) || 100) + 1,
  )
  const fileInputRef = useRef(null)

  const pushToast = useCallback((message, type = 'info') => {
    setToasts((current) => [...current, { id: Date.now() + Math.random(), message, type }])
  }, [])

  const removeToast = useCallback((toastId) => {
    setToasts((current) => current.filter((toast) => toast.id !== toastId))
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 700)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products))
  }, [products])

  const categories = useMemo(
    () => ['all', ...new Set(products.map((product) => product.category))],
    [products],
  )

  const filteredProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    const result = products
      .filter((product) => {
        const matchSearch =
          normalizedSearch.length === 0 ||
          product.name.toLowerCase().includes(normalizedSearch) ||
          product.brand.toLowerCase().includes(normalizedSearch) ||
          product.sku.toLowerCase().includes(normalizedSearch)

        const matchStatus = statusFilter === 'all' || product.status === statusFilter
        const matchCategory = categoryFilter === 'all' || product.category === categoryFilter

        return matchSearch && matchStatus && matchCategory
      })
      .sort((a, b) => {
        if (sortBy === 'price_asc') {
          return a.price - b.price
        }
        if (sortBy === 'price_desc') {
          return b.price - a.price
        }
        if (sortBy === 'name_asc') {
          return a.name.localeCompare(b.name)
        }
        return new Date(b.updatedAt) - new Date(a.updatedAt)
      })

    return result
  }, [products, search, statusFilter, categoryFilter, sortBy])

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE))

  const currentPage = Math.min(page, totalPages)

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    return filteredProducts.slice(start, start + PAGE_SIZE)
  }, [filteredProducts, currentPage])

  const applyMutation = (productId, updater, message) => {
    setProducts((current) =>
      current.map((product) => {
        if (product.id !== productId) {
          return product
        }

        const updated = updater(product)
        return {
          ...updated,
          updatedBy: 'Bryan',
          updatedAt: new Date().toISOString(),
          history: [message, ...(product.history || [])].slice(0, 3),
        }
      }),
    )
  }

  const duplicateProduct = (product) => {
    const nextId = nextIdRef.current
    nextIdRef.current += 1
    const clonedProduct = {
      ...product,
      id: nextId,
      name: `${product.name} (copia)`,
      sku: `${product.sku}-COPY`,
      status: 'draft',
      updatedBy: 'Bryan',
      updatedAt: new Date().toISOString(),
      history: ['Producto duplicado por Bryan'],
    }

    setProducts((current) => [clonedProduct, ...current])
    pushToast('Producto duplicado en borrador', 'success')
  }

  const pauseProduct = (productId) => {
    applyMutation(productId, (product) => ({ ...product, status: 'draft' }), 'Producto pausado')
    pushToast('Producto movido a borrador', 'info')
  }

  const deleteProduct = (productId) => {
    if (!window.confirm('¿Seguro que quieres eliminar este producto? Esta acción no se puede deshacer.')) {
      return
    }

    setProducts((current) => current.filter((product) => product.id !== productId))
    pushToast('Producto eliminado', 'error')
  }

  const markOutOfStock = (productId) => {
    applyMutation(
      productId,
      (product) => ({ ...product, status: 'out_of_stock', stock: 0 }),
      'Stock marcado como agotado',
    )
    pushToast('Producto marcado como agotado', 'info')
  }

  const importCsvProducts = (event) => {
    const selectedFile = event.target.files?.[0]
    if (!selectedFile) {
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      const csvText = String(reader.result || '')
      const lines = csvText
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)

      if (lines.length < 2) {
        pushToast('El CSV no contiene filas para importar', 'error')
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

          if (!data.name || !data.sku || !data.category || !data.brand) {
            return null
          }

          const nextId = nextIdRef.current
          nextIdRef.current += 1

          const stockValue = Number(data.stock || 0)
          const parsedStatus = ['draft', 'published', 'out_of_stock'].includes(data.status)
            ? data.status
            : stockValue === 0
              ? 'out_of_stock'
              : 'draft'

          return {
            id: nextId,
            name: data.name,
            category: data.category,
            brand: data.brand,
            sku: data.sku,
            price: Number(data.price || 0),
            stock: stockValue,
            discount: Number(data.discount || 0),
            tax: Number(data.tax || 19),
            rating: 4.5,
            status: parsedStatus,
            image:
              data.image ||
              'https://placehold.co/600x600/eef2ff/1f2937?text=Producto+importado',
            variants: {
              colors: [],
              sizes: [],
              warrantyMonths: 0,
            },
            tags: data.tags ? data.tags.split('|').map((tag) => tag.trim()).filter(Boolean) : [],
            updatedBy: 'Bryan',
            updatedAt: new Date().toISOString(),
            history: ['Producto importado por CSV'],
          }
        })
        .filter(Boolean)

      if (importedProducts.length === 0) {
        pushToast('No se encontraron productos válidos en el CSV', 'error')
        return
      }

      setProducts((current) => [...importedProducts, ...current])
      pushToast(`Se importaron ${importedProducts.length} productos`, 'success')
    }

    reader.readAsText(selectedFile)
    event.target.value = ''
  }

  return (
    <>
      <AdminLayout
        eyebrow="Gestión profesional"
        title="Catálogo de productos"
        breadcrumbs={['Panel', 'Productos']}
        actions={
          <>
            <button
              className="btn btn-ghost"
              type="button"
              onClick={() => fileInputRef.current?.click()}
            >
              Importar CSV
            </button>
            <Link className="btn btn-primary" to="/productos/nuevo">
              + Agregar producto
            </Link>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              className="sr-only-input"
              onChange={importCsvProducts}
            />
          </>
        }
      >
        <section className="catalog-card">
          <div className="catalog-toolbar">
            <input
              className="catalog-input"
              type="search"
              placeholder="Buscar por nombre, marca o SKU"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value)
                setPage(1)
              }}
            />

            <select
              className="catalog-select"
              value={statusFilter}
              onChange={(event) => {
                setStatusFilter(event.target.value)
                setPage(1)
              }}
            >
              <option value="all">Todos los estados</option>
              <option value="draft">Borrador</option>
              <option value="published">Publicado</option>
              <option value="out_of_stock">Agotado</option>
            </select>

            <select
              className="catalog-select"
              value={categoryFilter}
              onChange={(event) => {
                setCategoryFilter(event.target.value)
                setPage(1)
              }}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === 'all' ? 'Todas las categorías' : category}
                </option>
              ))}
            </select>

            <select
              className="catalog-select"
              value={sortBy}
              onChange={(event) => {
                setSortBy(event.target.value)
                setPage(1)
              }}
            >
              <option value="updated_desc">Más recientes</option>
              <option value="price_asc">Precio menor</option>
              <option value="price_desc">Precio mayor</option>
              <option value="name_asc">Nombre A-Z</option>
            </select>
          </div>

          {isLoading ? (
            <div className="skeleton-grid" aria-label="Cargando productos">
              {Array.from({ length: 4 }).map((_, index) => (
                <article key={index} className="skeleton-item" />
              ))}
            </div>
          ) : paginatedProducts.length === 0 ? (
            <section className="empty-state">
              <h3>No hay resultados con esos filtros</h3>
              <p>Prueba otros filtros o crea tu primer producto para empezar a vender.</p>
              <Link className="btn btn-primary" to="/productos/nuevo">
                Crear producto
              </Link>
            </section>
          ) : (
            <div className="catalog-grid">
              {paginatedProducts.map((product) => (
                <article key={product.id} className="catalog-item">
                  <img src={product.image} alt={product.name} className="catalog-image" loading="lazy" />
                  <div>
                    <p className="item-category">{product.category}</p>
                    <h3>{product.name}</h3>
                    <p className="item-meta">{product.brand} · SKU: {product.sku}</p>
                    <p className="item-meta">
                      <strong>${product.price}</strong> · Stock: {product.stock}
                    </p>
                    <p className={`status-pill status-${product.status}`}>{statusLabel[product.status]}</p>
                    <small className="history-item">
                      Último cambio: {product.updatedBy} · {formatDate(product.updatedAt)}
                    </small>
                    <small className="history-item">{product.history?.[0]}</small>
                  </div>

                  <div className="catalog-actions">
                    <button
                      type="button"
                      className="btn btn-ghost"
                      onClick={() => pushToast('Edición detallada en la siguiente iteración', 'info')}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost"
                      onClick={() => duplicateProduct(product)}
                    >
                      Duplicar
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost"
                      onClick={() => pauseProduct(product.id)}
                    >
                      Pausar
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost"
                      onClick={() => markOutOfStock(product.id)}
                    >
                      Agotado
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => deleteProduct(product.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}

          <footer className="pagination" aria-label="Paginación de productos">
            <button
              type="button"
              className="btn btn-ghost"
              disabled={currentPage === 1}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
            >
              Anterior
            </button>
            <span>
              Página {currentPage} de {totalPages}
            </span>
            <button
              type="button"
              className="btn btn-ghost"
              disabled={currentPage === totalPages}
              onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
            >
              Siguiente
            </button>
          </footer>
        </section>
      </AdminLayout>

      <ToastStack toasts={toasts} onDismiss={removeToast} />
    </>
  )
}

export default Products
