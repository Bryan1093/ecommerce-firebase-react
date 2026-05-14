import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import ToastStack from '../components/ui/ToastStack'
import { usePreferences } from '../context/PreferencesContext'
import { useStore } from '../context/StoreContext'

function Catalog() {
  const { formatCurrency } = usePreferences()
  const { products, addToCart, toggleWishlist, wishlistIds } = useStore()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [sortBy, setSortBy] = useState('featured')
  const [toasts, setToasts] = useState([])

  const categories = useMemo(() => ['all', ...new Set(products.map((product) => product.category))], [products])

  const filteredProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    return [...products]
      .filter((product) => product.status !== 'draft')
      .filter((product) => {
        const matchesSearch =
          !normalizedSearch ||
          product.name.toLowerCase().includes(normalizedSearch) ||
          product.brand.toLowerCase().includes(normalizedSearch) ||
          product.tags.some((tag) => tag.toLowerCase().includes(normalizedSearch))

        const matchesCategory = category === 'all' || product.category === category
        return matchesSearch && matchesCategory
      })
      .sort((a, b) => {
        if (sortBy === 'price_asc') return a.price - b.price
        if (sortBy === 'price_desc') return b.price - a.price
        if (sortBy === 'rating') return b.rating - a.rating
        return Number(b.featured) - Number(a.featured) || (b.sales || 0) - (a.sales || 0)
      })
  }, [category, products, search, sortBy])

  const pushToast = (message) => {
    setToasts((current) => [...current, { id: Date.now() + Math.random(), message, type: 'success' }])
  }

  return (
    <>
      <section className="storefront-stack">
        <article className="section-card toolbar-card">
          <div>
            <p className="eyebrow">Storefront</p>
            <h2>Catálogo con filtros rápidos y CTA claros</h2>
          </div>
          <div className="catalog-toolbar modern-toolbar">
            <input
              className="catalog-input"
              type="search"
              placeholder="Busca por nombre, marca o etiqueta"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <select className="catalog-select" value={category} onChange={(event) => setCategory(event.target.value)}>
              {categories.map((option) => (
                <option key={option} value={option}>
                  {option === 'all' ? 'Todas las categorías' : option}
                </option>
              ))}
            </select>
            <select className="catalog-select" value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
              <option value="featured">Destacados</option>
              <option value="rating">Mejor calificados</option>
              <option value="price_asc">Precio menor</option>
              <option value="price_desc">Precio mayor</option>
            </select>
          </div>
        </article>

        <section className="storefront-grid">
          {filteredProducts.map((product) => {
            const isWishlisted = wishlistIds.includes(product.id)
            return (
              <article key={product.id} className="store-card">
                <div className="store-card-media">
                  <img src={product.image} alt={product.name} className="store-card-image" loading="lazy" />
                  <button
                    type="button"
                    className="wishlist-button"
                    aria-pressed={isWishlisted}
                    onClick={() => {
                      toggleWishlist(product.id)
                      pushToast(isWishlisted ? 'Quitado de favoritos' : 'Añadido a favoritos')
                    }}
                  >
                    {isWishlisted ? '♥' : '♡'}
                  </button>
                </div>
                <div className="store-card-body">
                  <div className="product-badge-row">
                    {product.badges.slice(0, 2).map((badge) => (
                      <span key={badge} className="chip">
                        {badge}
                      </span>
                    ))}
                  </div>
                  <p className="item-category">{product.category} · {product.brand}</p>
                  <h3>{product.name}</h3>
                  <p className="item-meta">⭐ {product.rating} · {product.reviewCount} reseñas · Stock {product.stock}</p>
                  <p className="store-card-description">{product.description}</p>
                  <div className="price-row">
                    <strong>{formatCurrency(product.price)}</strong>
                    {product.compareAtPrice > product.price ? <small>{formatCurrency(product.compareAtPrice)}</small> : null}
                  </div>
                </div>
                <div className="catalog-actions store-card-actions">
                  <Link className="btn btn-ghost" to={`/productos/${product.slug}`}>
                    Ver detalle
                  </Link>
                  <button
                    type="button"
                    className="btn btn-primary"
                    disabled={product.stock === 0}
                    onClick={() => {
                      addToCart(product.id)
                      pushToast('Producto agregado al carrito')
                    }}
                  >
                    {product.stock === 0 ? 'Sin stock' : 'Agregar al carrito'}
                  </button>
                </div>
              </article>
            )
          })}
        </section>
      </section>
      <ToastStack toasts={toasts} onDismiss={(toastId) => setToasts((current) => current.filter((toast) => toast.id !== toastId))} />
    </>
  )
}

export default Catalog
