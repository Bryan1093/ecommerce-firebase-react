import { useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import ToastStack from '../components/ui/ToastStack'
import { usePreferences } from '../context/PreferencesContext'
import { useStore } from '../context/StoreContext'

function ProductDetail() {
  const { slug } = useParams()
  const { formatCurrency } = usePreferences()
  const { products, addToCart, toggleWishlist, wishlistIds } = useStore()
  const [toasts, setToasts] = useState([])
  const [selectedImage, setSelectedImage] = useState(0)

  const product = useMemo(() => products.find((entry) => entry.slug === slug), [products, slug])

  if (!product) {
    return <Navigate to="/productos" replace />
  }

  const isWishlisted = wishlistIds.includes(product.id)
  const estimatedDelivery = product.specs.entrega || 'Entrega en 2 a 4 días hábiles'

  return (
    <>
      <section className="product-detail-layout">
        <article className="section-card product-gallery-card">
          <img src={product.gallery[selectedImage] || product.image} alt={product.name} className="product-hero-image" />
          <div className="product-gallery-strip">
            {product.gallery.map((image, index) => (
              <button
                key={image}
                type="button"
                className={`gallery-thumb ${selectedImage === index ? 'gallery-thumb-active' : ''}`}
                onClick={() => setSelectedImage(index)}
              >
                <img src={image} alt={`${product.name} vista ${index + 1}`} className="product-thumb-image" />
              </button>
            ))}
          </div>
        </article>

        <article className="section-card product-info-card">
          <p className="eyebrow">{product.category} / {product.subcategory}</p>
          <h2>{product.name}</h2>
          <p className="item-meta">{product.brand} · SKU {product.sku} · ⭐ {product.rating}</p>
          <div className="price-row price-row-large">
            <strong>{formatCurrency(product.price)}</strong>
            {product.compareAtPrice > product.price ? <small>{formatCurrency(product.compareAtPrice)}</small> : null}
          </div>
          <p>{product.description}</p>
          <div className="chip-list">
            {product.highlights.map((highlight) => (
              <span key={highlight} className="chip">
                {highlight}
              </span>
            ))}
          </div>
          <div className="product-detail-grid">
            <div className="feature-panel">
              <h4>Stock y entrega</h4>
              <p>{product.stock > 0 ? `${product.stock} unidades disponibles` : 'Sin stock disponible'}</p>
              <strong>{estimatedDelivery}</strong>
            </div>
            <div className="feature-panel">
              <h4>Devoluciones</h4>
              <p>Compra protegida con cambios y devoluciones asistidas.</p>
              <strong>30 días calendario</strong>
            </div>
          </div>
          <div className="catalog-actions product-cta-row">
            <button
              type="button"
              className="btn btn-primary"
              disabled={product.stock === 0}
              onClick={() => {
                addToCart(product.id)
                setToasts((current) => [...current, { id: Date.now(), message: 'Producto agregado al carrito', type: 'success' }])
              }}
            >
              {product.stock === 0 ? 'Sin stock' : 'Agregar al carrito'}
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => {
                toggleWishlist(product.id)
                setToasts((current) => [
                  ...current,
                  {
                    id: Date.now() + 1,
                    message: isWishlisted ? 'Producto quitado de favoritos' : 'Producto añadido a favoritos',
                    type: 'info',
                  },
                ])
              }}
            >
              {isWishlisted ? 'Quitar de wishlist' : 'Guardar en wishlist'}
            </button>
            <Link className="btn btn-ghost" to="/checkout">
              Comprar ahora
            </Link>
          </div>

          <section className="spec-list">
            {Object.entries(product.specs).map(([key, value]) => (
              <div key={key} className="spec-item">
                <dt>{key}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </section>
        </article>
      </section>

      <section className="section-card reviews-card">
        <header className="section-header section-header-inline">
          <div>
            <p className="eyebrow">Prueba social</p>
            <h3>Reseñas destacadas</h3>
          </div>
        </header>
        <div className="modern-grid two-cols">
          {product.reviews.map((review) => (
            <article key={review.id} className="feature-panel">
              <strong>{review.author}</strong>
              <p>⭐ {review.rating}</p>
              <p>{review.comment}</p>
            </article>
          ))}
        </div>
      </section>

      <ToastStack toasts={toasts} onDismiss={(toastId) => setToasts((current) => current.filter((toast) => toast.id !== toastId))} />
    </>
  )
}

export default ProductDetail
