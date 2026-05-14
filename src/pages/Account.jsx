import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { usePreferences } from '../context/PreferencesContext'
import { useStore } from '../context/StoreContext'

function Account() {
  const { user } = useAuth()
  const { formatCurrency, formatDateTime } = usePreferences()
  const { customers, orders } = useStore()

  const customer = customers.find((entry) => entry.email === user?.email) || customers[0]
  const customerOrders = orders.filter((order) => order.customerEmail === customer.email)

  return (
    <section className="storefront-stack">
      <article className="section-card account-hero">
        <div>
          <p className="eyebrow">Mi cuenta</p>
          <h2>{customer.name}</h2>
          <p>{customer.email}</p>
        </div>
        <div className="hero-stats-grid">
          <article className="metric-card compact">
            <span>Segmento</span>
            <strong>{customer.segment}</strong>
          </article>
          <article className="metric-card compact">
            <span>Pedidos</span>
            <strong>{customer.orders}</strong>
          </article>
          <article className="metric-card compact">
            <span>Total gastado</span>
            <strong>{formatCurrency(customer.totalSpent)}</strong>
          </article>
        </div>
      </article>

      <section className="modern-grid two-cols">
        <article className="section-card">
          <header className="section-header">
            <h3>Postventa</h3>
            <p>Recompra, seguimiento y próximos pasos del cliente.</p>
          </header>
          <div className="feature-panel-list">
            <article className="feature-panel feature-panel-inline">
              <div>
                <h4>Recompra rápida</h4>
                <p>Construye un carrito nuevo desde pedidos pasados.</p>
              </div>
              <Link className="btn btn-ghost" to="/productos">
                Comprar de nuevo
              </Link>
            </article>
            <article className="feature-panel feature-panel-inline">
              <div>
                <h4>Facturas y comprobantes</h4>
                <p>Descarga y consulta pagos autorizados desde tu historial.</p>
              </div>
              <button type="button" className="btn btn-ghost">
                Ver documentos
              </button>
            </article>
          </div>
        </article>

        <article className="section-card">
          <header className="section-header">
            <h3>Estado de compras</h3>
            <p>Visibilidad completa del ciclo de entrega.</p>
          </header>
          <div className="feature-panel-list">
            {customerOrders.slice(0, 3).map((order) => (
              <article key={order.id} className="feature-panel">
                <p className="item-category">{order.number}</p>
                <h4>{order.status}</h4>
                <p>{formatDateTime(order.createdAt)}</p>
                <strong>{formatCurrency(order.total)}</strong>
              </article>
            ))}
          </div>
        </article>
      </section>

      <section className="section-card">
        <header className="section-header section-header-inline">
          <div>
            <p className="eyebrow">Historial</p>
            <h3>Pedidos recientes</h3>
          </div>
        </header>
        <div className="order-list">
          {customerOrders.map((order) => (
            <article key={order.id} className="order-card">
              <div>
                <p className="item-category">{order.number}</p>
                <h4>{formatDateTime(order.createdAt)}</h4>
                <p>{order.timeline?.[0]}</p>
              </div>
              <div>
                <p className={`status-pill status-${order.status}`}>{order.status}</p>
                <strong>{formatCurrency(order.total)}</strong>
              </div>
            </article>
          ))}
        </div>
      </section>
    </section>
  )
}

export default Account
