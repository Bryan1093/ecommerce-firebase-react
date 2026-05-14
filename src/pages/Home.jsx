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
          <p className="eyebrow">Lo más descargado esta semana</p>
          <h2>Descubre ofertas como en una app store</h2>
          <p>
            Explora productos populares, categorías destacadas y recomendaciones personalizadas
            en una interfaz limpia y rápida.
          </p>
          <div className="hero-actions">
            <Link className="btn btn-primary" to="/productos">
              Ver catálogo
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
          <h3>Categorías populares</h3>
        </header>
        <ul className="chip-list" aria-label="Categorías destacadas">
          <li className="chip">🔥 Tendencias</li>
          <li className="chip">🎧 Audio</li>
          <li className="chip">⌚ Wearables</li>
          <li className="chip">🏠 Hogar inteligente</li>
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
