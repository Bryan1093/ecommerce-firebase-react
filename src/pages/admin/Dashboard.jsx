import { Link } from 'react-router-dom'
import AdminLayout from '../../components/admin/AdminLayout'
import { usePreferences } from '../../context/PreferencesContext'
import { useStore } from '../../context/StoreContext'

function Dashboard() {
  const { formatCurrency } = usePreferences()
  const { lowStockProducts, metrics, orders, promotions } = useStore()

  const recentOrders = orders.slice(0, 3)

  return (
    <AdminLayout
      eyebrow="Backoffice overview"
      title="Dashboard operativo"
      breadcrumbs={['Admin', 'Dashboard']}
      actions={
        <>
          <Link className="btn btn-ghost" to="/admin/marketing">
            Revisar campañas
          </Link>
          <Link className="btn btn-primary" to="/admin/productos/nuevo">
            Crear producto
          </Link>
        </>
      }
    >
      <section className="dashboard-grid">
        <article className="metric-card">
          <span>Ingresos</span>
          <strong>{formatCurrency(metrics.totalRevenue)}</strong>
          <small>Ventas acumuladas del prototipo</small>
        </article>
        <article className="metric-card">
          <span>Ticket promedio</span>
          <strong>{formatCurrency(metrics.averageTicket)}</strong>
          <small>Optimiza bundles y cross-sell</small>
        </article>
        <article className="metric-card">
          <span>Productos publicados</span>
          <strong>{metrics.publishedProducts}</strong>
          <small>Catálogo visible en storefront</small>
        </article>
        <article className="metric-card">
          <span>Clientes activos</span>
          <strong>{metrics.activeCustomers}</strong>
          <small>Usuarios con historial reciente</small>
        </article>
      </section>

      <section className="modern-grid two-cols">
        <article className="section-card">
          <header className="section-header">
            <h3>Alertas prioritarias</h3>
            <p>Controla stock bajo, pedidos retenidos y campañas activas.</p>
          </header>
          <div className="feature-panel-list">
            {lowStockProducts.map((product) => (
              <article key={product.id} className="feature-panel feature-panel-inline">
                <div>
                  <h4>{product.name}</h4>
                  <p>{product.category}</p>
                </div>
                <strong>{product.stock} uds</strong>
              </article>
            ))}
          </div>
        </article>

        <article className="section-card">
          <header className="section-header">
            <h3>Pedidos recientes</h3>
            <p>Seguimiento operativo desde el dashboard.</p>
          </header>
          <div className="order-list">
            {recentOrders.map((order) => (
              <article key={order.id} className="order-card">
                <div>
                  <p className="item-category">{order.number}</p>
                  <h4>{order.customerName}</h4>
                  <p>{order.timeline?.[0]}</p>
                </div>
                <p className={`status-pill status-${order.status}`}>{order.status}</p>
              </article>
            ))}
          </div>
        </article>
      </section>

      <section className="section-card">
        <header className="section-header section-header-inline">
          <div>
            <h3>Promociones y contenido</h3>
            <p>Flujo inicial de campañas, banners y personalización comercial.</p>
          </div>
        </header>
        <div className="modern-grid three-cols">
          {promotions.map((promotion) => (
            <article key={promotion.id} className="feature-panel">
              <p className="item-category">{promotion.status}</p>
              <h4>{promotion.name}</h4>
              <p>{promotion.description}</p>
            </article>
          ))}
        </div>
      </section>
    </AdminLayout>
  )
}

export default Dashboard
