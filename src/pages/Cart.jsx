import { Link } from 'react-router-dom'
import { usePreferences } from '../context/PreferencesContext'
import { useStore } from '../context/StoreContext'

function Cart() {
  const { formatCurrency } = usePreferences()
  const { cartDetailedItems, updateCartQuantity } = useStore()

  const subtotal = cartDetailedItems.reduce((accumulator, item) => accumulator + item.total, 0)

  return (
    <section className="storefront-stack">
      <article className="section-card section-header-inline">
        <div>
          <p className="eyebrow">Carrito persistente</p>
          <h2>Resumen rápido antes del checkout</h2>
        </div>
        <Link to="/checkout" className="btn btn-primary" aria-disabled={cartDetailedItems.length === 0}>
          Continuar al checkout
        </Link>
      </article>

      {cartDetailedItems.length === 0 ? (
        <article className="empty-state">
          <h3>Tu carrito está vacío</h3>
          <p>Explora productos, guarda favoritos y vuelve cuando quieras.</p>
          <Link className="btn btn-primary" to="/productos">
            Ir al catálogo
          </Link>
        </article>
      ) : (
        <div className="checkout-layout-grid">
          <section className="section-card order-list">
            {cartDetailedItems.map((item) => (
              <article key={item.productId} className="order-card cart-row">
                <img src={item.product.image} alt={item.product.name} className="catalog-image" />
                <div>
                  <p className="item-category">{item.product.category}</p>
                  <h4>{item.product.name}</h4>
                  <p>{formatCurrency(item.product.price)} c/u</p>
                </div>
                <div className="quantity-control">
                  <button type="button" className="btn btn-ghost" onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}>
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button type="button" className="btn btn-ghost" onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}>
                    +
                  </button>
                </div>
                <strong>{formatCurrency(item.total)}</strong>
              </article>
            ))}
          </section>

          <aside className="section-card summary-sticky-card">
            <p className="eyebrow">Resumen</p>
            <h3>Total estimado</h3>
            <div className="summary-line">
              <span>Subtotal</span>
              <strong>{formatCurrency(subtotal)}</strong>
            </div>
            <div className="summary-line">
              <span>Envío</span>
              <strong>Gratis</strong>
            </div>
            <div className="summary-line total-line">
              <span>Total</span>
              <strong>{formatCurrency(subtotal)}</strong>
            </div>
            <Link className="btn btn-primary btn-block" to="/checkout">
              Ir al checkout
            </Link>
          </aside>
        </div>
      )}
    </section>
  )
}

export default Cart
