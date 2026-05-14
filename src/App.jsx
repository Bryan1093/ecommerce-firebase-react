import { Route, Routes } from 'react-router-dom'
import './App.css'
import Footer from './components/Footer'
import Header from './components/Header'
import Home from './pages/Home'
import NewProduct from './pages/NewProduct'
import Products from './pages/Products'

function App() {
  return (
    <div className="app-shell">
      <Header />
      <main className="site-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/productos" element={<Products />} />
          <Route path="/productos/nuevo" element={<NewProduct />} />
          <Route
            path="/carrito"
            element={
              <section className="page-content">
                <p className="eyebrow">Mis compras</p>
                <h2>Carrito</h2>
                <p>Tu carrito está vacío por ahora.</p>
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
