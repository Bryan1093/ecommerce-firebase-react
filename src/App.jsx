import { Route, Routes } from 'react-router-dom'
import './App.css'
import Footer from './components/Footer'
import Header from './components/Header'
import { usePreferences } from './context/PreferencesContext'
import Home from './pages/Home'
import NewProduct from './pages/NewProduct'
import Products from './pages/Products'
import Settings from './pages/Settings'

function App() {
  const { t } = usePreferences()

  return (
    <div className="app-shell">
      <Header />
      <main className="site-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/productos" element={<Products />} />
          <Route path="/productos/nuevo" element={<NewProduct />} />
          <Route path="/configuracion" element={<Settings />} />
          <Route
            path="/carrito"
            element={
              <section className="page-content">
                <p className="eyebrow">{t('cart.eyebrow')}</p>
                <h2>{t('cart.title')}</h2>
                <p>{t('cart.description')}</p>
              </section>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
