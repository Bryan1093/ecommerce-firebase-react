import { Link } from 'react-router-dom'
import { usePreferences } from '../context/PreferencesContext'
import { useStore } from '../context/StoreContext'

function Wishlist() {
  const { formatCurrency } = usePreferences()
  const { wishlistProducts, addToCart, toggleWishlist } = useStore()

  return (
    <section className="storefront-stack">
      <article className="section-card section-header-inline">
        <div>
          <p className="eyebrow">Wishlist</p>
          <h2>Favoritos guardados para volver más rápido</h2>
        </div>
        <Link to="/productos" className="btn btn-ghost">
          Seguir explorando
        </Link>
      </article>

      {wishlistProducts.length === 0 ? (
        <article className="empty-state">
          <h3>Aún no guardas productos</h3>
          <p>Usa el ícono de favorito desde el catálogo o detalle para construir tu shortlist.</p>
        </article>
      ) : (
        <section className="storefront-grid">
          {wishlistProducts.map((product) => (
            <article key={product.id} className="store-card">
              <img src={product.image} alt={product.name} className="store-card-image" loading="lazy" />
              <div className="store-card-body">
                <p className="item-category">{product.category}</p>
                <h3>{product.name}</h3>
                <p className="item-meta">{product.brand}</p>
                <strong>{formatCurrency(product.price)}</strong>
              </div>
              <div className="catalog-actions store-card-actions">
                <button type="button" className="btn btn-primary" onClick={() => addToCart(product.id)}>
                  Agregar al carrito
                </button>
                <button type="button" className="btn btn-ghost" onClick={() => toggleWishlist(product.id)}>
                  Quitar
                </button>
              </div>
            </article>
          ))}
        </section>
      )}
    </section>
  )
}

export default Wishlist
