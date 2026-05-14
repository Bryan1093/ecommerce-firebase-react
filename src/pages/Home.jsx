import { Link } from 'react-router-dom'
import heroImage from '../assets/hero.png'
import { usePreferences } from '../context/PreferencesContext'

function Home() {
  const { formatCurrency, t } = usePreferences()

  const featuredProducts = [
    {
      title: 'Smartwatch Pro',
      category: t('categories.electronics'),
      rating: '4.8',
      price: formatCurrency(129),
    },
    {
      title: 'Audio Max Buds',
      category: 'Audio',
      rating: '4.7',
      price: formatCurrency(89),
    },
    {
      title: 'Mini Drone X',
      category: 'Gadgets',
      rating: '4.6',
      price: formatCurrency(199),
    },
  ]

  return (
    <section className="home-page">
      <article className="hero-card">
        <div>
          <p className="eyebrow">{t('home.eyebrow')}</p>
          <h2>{t('home.title')}</h2>
          <p>{t('home.description')}</p>
          <div className="hero-actions">
            <Link className="btn btn-primary" to="/productos">
              {t('home.goToPanel')}
            </Link>
            <Link className="btn btn-ghost" to="/productos/nuevo">
              {t('home.addProduct')}
            </Link>
            <Link className="btn btn-ghost" to="/carrito">
              {t('home.goToCart')}
            </Link>
          </div>
        </div>
        <img src={heroImage} alt={t('home.heroAlt')} className="hero-image" />
      </article>

      <article className="section-card">
        <header className="section-header">
          <h3>{t('home.toolsTitle')}</h3>
        </header>
        <ul className="chip-list" aria-label={t('home.toolsTitle')}>
          <li className="chip">{t('home.toolWizard')}</li>
          <li className="chip">{t('home.toolValidation')}</li>
          <li className="chip">{t('home.toolInventory')}</li>
          <li className="chip">{t('home.toolFilters')}</li>
        </ul>
      </article>

      <article className="section-card">
        <header className="section-header">
          <h3>{t('home.featuredTitle')}</h3>
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
