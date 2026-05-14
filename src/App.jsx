import { Route, Routes } from 'react-router-dom'
import './App.css'
import Footer from './components/Footer'
import Header from './components/Header'
import Home from './pages/Home'

function App() {
  return (
    <div className="app-shell">
      <Header />
      <main className="site-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/productos"
            element={
              <section className="page-content">
                <p className="eyebrow">Catálogo</p>
                <h2>Productos</h2>
                <p>Próximamente podrás explorar el catálogo completo.</p>
              </section>
            }
          />
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
