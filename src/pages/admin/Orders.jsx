import AdminLayout from '../../components/admin/AdminLayout'
import { usePreferences } from '../../context/PreferencesContext'
import { useStore } from '../../context/StoreContext'

function Orders() {
  const { formatCurrency, formatDateTime } = usePreferences()
  const { orders, updateOrderStatus } = useStore()

  return (
    <AdminLayout eyebrow="Fulfillment" title="Gestión de pedidos" breadcrumbs={['Admin', 'Pedidos']}>
      <section className="order-list">
        {orders.map((order) => (
          <article key={order.id} className="section-card order-board-card">
            <div className="order-board-header">
              <div>
                <p className="item-category">{order.number}</p>
                <h3>{order.customerName}</h3>
                <p>{order.customerEmail} · {formatDateTime(order.createdAt)}</p>
              </div>
              <div className="catalog-actions">
                <p className={`status-pill status-${order.status}`}>{order.status}</p>
                <select className="catalog-select" value={order.status} onChange={(event) => updateOrderStatus(order.id, event.target.value)}>
                  <option value="pending">pending</option>
                  <option value="paid">paid</option>
                  <option value="shipped">shipped</option>
                  <option value="delivered">delivered</option>
                  <option value="cancelled">cancelled</option>
                </select>
              </div>
            </div>
            <div className="modern-grid two-cols align-start">
              <div className="feature-panel-list compact-list">
                {order.items.map((item) => (
                  <article key={`${order.id}-${item.productId}`} className="feature-panel feature-panel-inline">
                    <div>
                      <strong>Producto #{item.productId}</strong>
                      <p>{item.quantity} unidades</p>
                    </div>
                    <span>{formatCurrency(item.unitPrice * item.quantity)}</span>
                  </article>
                ))}
              </div>
              <div className="feature-panel-list compact-list">
                {order.timeline?.map((event) => (
                  <article key={event} className="feature-panel">
                    <strong>Timeline</strong>
                    <p>{event}</p>
                  </article>
                ))}
              </div>
            </div>
            <div className="summary-line total-line">
              <span>Método de pago: {order.paymentMethod}</span>
              <strong>{formatCurrency(order.total)}</strong>
            </div>
          </article>
        ))}
      </section>
    </AdminLayout>
  )
}

export default Orders
