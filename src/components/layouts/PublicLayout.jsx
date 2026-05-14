import { Outlet } from 'react-router-dom'
import Footer from '../Footer'
import Header from '../Header'

function PublicLayout() {
  return (
    <div className="app-shell">
      <Header />
      <main className="site-main">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default PublicLayout
