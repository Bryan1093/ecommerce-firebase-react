import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ToastStack from '../components/ui/ToastStack'
import { useAuth } from '../context/AuthContext'
import { usePreferences } from '../context/PreferencesContext'
import { useStore } from '../context/StoreContext'

const initialForm = {
  customerName: 'Laura Gómez',
  customerEmail: 'laura@demo.com',
  document: '',
  address: '',
  city: '',
  notes: '',
  paymentMethod: 'Stripe',
}

function Checkout() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { formatCurrency } = usePreferences()
  const { cartDetailedItems, paymentMethods, placeOrder } = useStore()
  const [form, setForm] = useState(() => ({ ...initialForm, customerEmail: user?.email || initialForm.customerEmail, customerName: user?.name || initialForm.customerName }))
  const [toasts, setToasts] = useState([])

  const subtotal = useMemo(
    () => cartDetailedItems.reduce((accumulator, item) => accumulator + item.total, 0),
    [cartDetailedItems],
  )

  const handleSubmit = (event) => {
    event.preventDefault()

    if (cartDetailedItems.length === 0) {
      setToasts((current) => [...current, { id: Date.now(), message: 'Tu carrito está vacío', type: 'error' }])
      return
    }

    const order = placeOrder({
      customerId: user?.id,
      customerName: form.customerName,
      customerEmail: form.customerEmail,
      paymentMethod: form.paymentMethod,
    })

    setToasts((current) => [...current, { id: Date.now(), message: `Pedido ${order.number} creado con éxito`, type: 'success' }])
    navigate('/cuenta')
  }

  return (
    <>
      <section className="checkout-layout-grid">
        <form className="section-card checkout-form" onSubmit={handleSubmit}>
          <header className="section-header">
            <p className="eyebrow">Checkout express</p>
            <h2>Pago seguro en una sola vista</h2>
            <p>Incluye datos del comprador, envío, pago y resumen final.</p>
          </header>

          <div className="wizard-fields">
            <label>
              Nombre completo
              <input value={form.customerName} onChange={(event) => setForm((current) => ({ ...current, customerName: event.target.value }))} required />
            </label>
            <label>
              Correo electrónico
              <input type="email" value={form.customerEmail} onChange={(event) => setForm((current) => ({ ...current, customerEmail: event.target.value }))} required />
            </label>
            <label>
              Documento
              <input value={form.document} onChange={(event) => setForm((current) => ({ ...current, document: event.target.value }))} />
            </label>
            <label>
              Ciudad
              <input value={form.city} onChange={(event) => setForm((current) => ({ ...current, city: event.target.value }))} required />
            </label>
            <label className="field-span-2">
              Dirección
              <input value={form.address} onChange={(event) => setForm((current) => ({ ...current, address: event.target.value }))} required />
            </label>
            <label className="field-span-2">
              Método de pago
              <select value={form.paymentMethod} onChange={(event) => setForm((current) => ({ ...current, paymentMethod: event.target.value }))}>
                {paymentMethods.map((method) => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
              </select>
            </label>
            <label className="field-span-2">
              Notas de entrega
              <textarea value={form.notes} onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))} rows="3" />
            </label>
          </div>

          <button type="submit" className="btn btn-primary btn-block">
            Confirmar compra
          </button>
        </form>

        <aside className="section-card summary-sticky-card">
          <p className="eyebrow">Order summary</p>
          <h3>Tu pedido</h3>
          <div className="feature-panel-list compact-list">
            {cartDetailedItems.map((item) => (
              <article key={item.productId} className="feature-panel feature-panel-inline">
                <div>
                  <strong>{item.product.name}</strong>
                  <p>{item.quantity} x {formatCurrency(item.product.price)}</p>
                </div>
                <span>{formatCurrency(item.total)}</span>
              </article>
            ))}
          </div>
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
          <p className="item-meta">La confirmación del pago y el comprobante se disparan vía eventos/webhooks en la siguiente fase backend.</p>
        </aside>
      </section>
      <ToastStack toasts={toasts} onDismiss={(toastId) => setToasts((current) => current.filter((toast) => toast.id !== toastId))} />
    </>
  )
}

export default Checkout
