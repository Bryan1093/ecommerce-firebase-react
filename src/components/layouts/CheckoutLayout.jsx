import { Outlet } from 'react-router-dom'
import Footer from '../Footer'
import Header from '../Header'

function CheckoutLayout() {
  return (
    <div className="app-shell checkout-shell">
      <Header compact />
      <main className="site-main checkout-main">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default CheckoutLayout
