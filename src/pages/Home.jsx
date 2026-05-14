import { Link } from 'react-router-dom'
import { usePreferences } from '../context/PreferencesContext'
import { useStore } from '../context/StoreContext'
import heroImage from '../assets/hero.png'

function Home() {
  const { formatCurrency } = usePreferences()
  const { metrics, products, promotions, lowStockProducts } = useStore()

  const featuredProducts = products.filter((product) => product.featured).slice(0, 3)
  const categories = [
    { name: 'Electrónica', description: 'Wearables, audio y gadgets listos para enviar.' },
    { name: 'Moda', description: 'Drops curados, esenciales y favoritos del mes.' },
    { name: 'Hogar', description: 'Smart living con entregas rápidas y soporte.' },
  ]

  return (
    <section className="storefront-stack">
      <article className="hero-card hero-card-modern">
        <div>
          <p className="eyebrow">Ecommerce modernizado 2026</p>
          <h2>Una tienda pensada para convertir, operar y escalar.</h2>
          <p>
            Separamos storefront, checkout y admin en una sola experiencia prototipo con catálogo, wishlist,
            carrito persistente, pedidos y panel operativo.
          </p>
          <div className="hero-actions">
            <Link className="btn btn-primary" to="/productos">
              Explorar catálogo
            </Link>
            <Link className="btn btn-ghost" to="/checkout">
              Checkout rápido
            </Link>
            <Link className="btn btn-ghost" to="/admin">
              Ir al backoffice
            </Link>
          </div>
          <div className="hero-stats-grid">
            <article className="metric-card compact">
              <span>Ingresos demo</span>
              <strong>{formatCurrency(metrics.totalRevenue)}</strong>
            </article>
            <article className="metric-card compact">
              <span>Productos publicados</span>
              <strong>{metrics.publishedProducts}</strong>
            </article>
            <article className="metric-card compact">
              <span>Alertas low stock</span>
              <strong>{metrics.lowStockCount}</strong>
            </article>
          </div>
        </div>
        <img src={heroImage} alt="Experiencia moderna de ecommerce" className="hero-image hero-image-tall" />
      </article>

      <section className="section-card trust-grid">
        <article>
          <p className="eyebrow">UX/UI</p>
          <h3>Compra fluida y visual.</h3>
          <p>Header sticky, skeletons, dark mode, mini-cart y navegación orientada a conversión.</p>
        </article>
        <article>
          <p className="eyebrow">Operación</p>
          <h3>Admin con foco en decisiones.</h3>
          <p>KPIs, pedidos, clientes, campañas y alertas críticas en un solo tablero.</p>
        </article>
        <article>
          <p className="eyebrow">Arquitectura</p>
          <h3>Base lista para evolucionar.</h3>
          <p>Estado compartido por dominios y rutas separadas para storefront, checkout y backoffice.</p>
        </article>
      </section>

      <section className="section-card">
        <header className="section-header section-header-inline">
          <div>
            <p className="eyebrow">Categorías</p>
            <h3>Navegación simple y enfocada</h3>
          </div>
          <Link to="/productos" className="btn btn-ghost">
            Ver catálogo completo
          </Link>
        </header>
        <div className="modern-grid three-cols">
          {categories.map((category) => (
            <article key={category.name} className="feature-panel">
              <h4>{category.name}</h4>
              <p>{category.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-card">
        <header className="section-header section-header-inline">
          <div>
            <p className="eyebrow">Best sellers</p>
            <h3>Productos con mayor intención de compra</h3>
          </div>
        </header>
        <div className="product-showcase-grid">
          {featuredProducts.map((product) => (
            <article key={product.id} className="product-showcase-card">
              <img src={product.image} alt={product.name} className="product-showcase-image" loading="lazy" />
              <div>
                <p className="item-category">{product.category}</p>
                <h4>{product.name}</h4>
                <p className="item-meta">{product.badges.join(' · ')}</p>
                <strong>{formatCurrency(product.price)}</strong>
              </div>
              <Link className="btn btn-primary" to={`/productos/${product.slug}`}>
                Ver detalle
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="section-card">
        <header className="section-header section-header-inline">
          <div>
            <p className="eyebrow">Promociones activas</p>
            <h3>Campañas listas para operar</h3>
          </div>
        </header>
        <div className="modern-grid three-cols">
          {promotions.map((promotion) => (
            <article key={promotion.id} className="feature-panel">
              <span className="status-pill status-published">{promotion.status}</span>
              <h4>{promotion.name}</h4>
              <p>{promotion.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-card">
        <header className="section-header section-header-inline">
          <div>
            <p className="eyebrow">Operación crítica</p>
            <h3>Productos que requieren atención</h3>
          </div>
          <Link to="/admin/pedidos" className="btn btn-ghost">
            Revisar pedidos y alertas
          </Link>
        </header>
        <div className="modern-grid two-cols">
          {lowStockProducts.slice(0, 4).map((product) => (
            <article key={product.id} className="feature-panel feature-panel-inline">
              <div>
                <h4>{product.name}</h4>
                <p>{product.brand} · {product.category}</p>
              </div>
              <strong>{product.stock} unidades</strong>
            </article>
          ))}
        </div>
      </section>
    </section>
  )
}

export default Home
