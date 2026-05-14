import AdminLayout from '../../components/admin/AdminLayout'
import { usePreferences } from '../../context/PreferencesContext'
import { useStore } from '../../context/StoreContext'

function Customers() {
  const { formatCurrency, formatDateTime } = usePreferences()
  const { customers } = useStore()

  return (
    <AdminLayout eyebrow="CRM" title="Clientes y segmentos" breadcrumbs={['Admin', 'Clientes']}>
      <section className="modern-grid three-cols">
        {customers.map((customer) => (
          <article key={customer.id} className="feature-panel customer-card">
            <p className="item-category">{customer.segment}</p>
            <h3>{customer.name}</h3>
            <p>{customer.email}</p>
            <div className="summary-line">
              <span>Pedidos</span>
              <strong>{customer.orders}</strong>
            </div>
            <div className="summary-line">
              <span>LTV</span>
              <strong>{formatCurrency(customer.totalSpent)}</strong>
            </div>
            <p className="item-meta">Último pedido: {formatDateTime(customer.lastOrderAt)}</p>
          </article>
        ))}
      </section>
    </AdminLayout>
  )
}

export default Customers
