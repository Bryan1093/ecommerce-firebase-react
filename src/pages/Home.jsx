import { Link } from 'react-router-dom'
import heroImage from '../assets/hero.png'

function Home() {
  const featuredProducts = [
    {
      title: 'Smartwatch Pro',
      category: 'Wearables',
      rating: '4.8',
      price: '$129',
    },
    {
      title: 'Audio Max Buds',
      category: 'Audio',
      rating: '4.7',
      price: '$89',
    },
    {
      title: 'Mini Drone X',
      category: 'Gadgets',
      rating: '4.6',
      price: '$199',
    },
  ]

  return (
    <section className="home-page">
      <article className="hero-card">
        <div>
          <p className="eyebrow">Lo más vendido esta semana</p>
          <h2>Vende con una experiencia tipo marketplace</h2>
          <p>
            Gestiona catálogo, crea productos paso a paso y publica con una interfaz intuitiva,
            rápida y preparada para crecer.
          </p>
          <div className="hero-actions">
            <Link className="btn btn-primary" to="/productos">
              Ir al panel
            </Link>
            <Link className="btn btn-ghost" to="/productos/nuevo">
              Agregar producto
            </Link>
            <Link className="btn btn-ghost" to="/carrito">
              Ir al carrito
            </Link>
          </div>
        </div>
        <img src={heroImage} alt="Colección de productos destacados" className="hero-image" />
      </article>

      <article className="section-card">
        <header className="section-header">
          <h3>Herramientas del panel</h3>
        </header>
        <ul className="chip-list" aria-label="Herramientas destacadas">
          <li className="chip">🧭 Wizard guiado</li>
          <li className="chip">⚡ Validación en vivo</li>
          <li className="chip">📦 Estados de inventario</li>
          <li className="chip">📊 Filtros y paginación</li>
        </ul>
      </article>

      <article className="section-card">
        <header className="section-header">
          <h3>Destacados para ti</h3>
        </header>
        <div className="featured-grid">
          {featuredProducts.map((item) => (
            <article key={item.title} className="featured-item">
              <p className="item-category">{item.category}</p>
              <h4>{item.title}</h4>
              <p className="item-meta">⭐ {item.rating}</p>
              <strong>{item.price}</strong>
            </article>
          ))}
        </div>
      </article>
    </section>
  )
}

export default Home
