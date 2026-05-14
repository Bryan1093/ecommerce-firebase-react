import { NavLink } from 'react-router-dom'
import { usePreferences } from '../context/PreferencesContext'

function Header() {
  const { theme, setTheme, t } = usePreferences()
  const navLinkClass = ({ isActive }) => (isActive ? 'nav-link nav-link-active' : 'nav-link')
  const nextTheme = theme === 'light' ? 'dark' : 'light'

  return (
    <header className="site-header">
      <div className="brand-wrap">
        <h1 className="brand">
          <span className="brand-badge">MT</span>
          {t('app.name')}
        </h1>
        <small className="theme-caption">{t('header.currentTheme', { theme: t(`themes.${theme}`) })}</small>
      </div>
      <nav aria-label="Navegación principal">
        <ul className="nav-links">
          <li>
            <NavLink to="/" className={navLinkClass}>
              {t('navigation.home')}
            </NavLink>
          </li>
          <li>
            <NavLink to="/productos" className={navLinkClass}>
              {t('navigation.products')}
            </NavLink>
          </li>
          <li>
            <NavLink to="/carrito" className={navLinkClass}>
              {t('navigation.cart')}
            </NavLink>
          </li>
          <li>
            <NavLink to="/configuracion" className={navLinkClass}>
              {t('navigation.settings')}
            </NavLink>
          </li>
        </ul>
      </nav>
      <button
        type="button"
        className="btn btn-ghost theme-toggle"
        onClick={() => setTheme(nextTheme)}
        aria-label={t('header.themeToggle', { theme: t(`themes.${nextTheme}`) })}
      >
        {theme === 'light' ? '🌙' : '☀️'} {t(`themes.${nextTheme}`)}
      </button>
    </header>
  )
}

export default Header
