import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { usePreferences } from '../context/PreferencesContext'
import { useStore } from '../context/StoreContext'

function Header({ compact = false }) {
  const { theme, setTheme, t } = usePreferences()
  const { user, isAdmin, logout } = useAuth()
  const { cartDetailedItems, wishlistIds } = useStore()
  const navLinkClass = ({ isActive }) => (isActive ? 'nav-link nav-link-active' : 'nav-link')
  const nextTheme = theme === 'light' ? 'dark' : 'light'

  return (
    <header className={`site-header ${compact ? 'site-header-compact' : ''}`}>
      <div className="brand-wrap">
        <h1 className="brand">
          <span className="brand-badge">MT</span>
          {t('app.name')}
        </h1>
        <small className="theme-caption">{user ? `${user.name} · ${isAdmin ? 'Administrador' : 'Cliente'}` : 'Sin sesión'}</small>
      </div>

      <nav aria-label="Navegación principal" className="nav-shell">
        <ul className="nav-links">
          <li>
            <NavLink to="/" className={navLinkClass} end>
              Inicio
            </NavLink>
          </li>
          <li>
            <NavLink to="/productos" className={navLinkClass}>
              Catálogo
            </NavLink>
          </li>
          <li>
            <NavLink to="/favoritos" className={navLinkClass}>
              Favoritos <span className="nav-counter">{wishlistIds.length}</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/carrito" className={navLinkClass}>
              Carrito <span className="nav-counter">{cartDetailedItems.length}</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/cuenta" className={navLinkClass}>
              Cuenta
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin" className={navLinkClass}>
              Admin
            </NavLink>
          </li>
        </ul>
      </nav>

      <div className="header-actions-group">
        <button
          type="button"
          className="btn btn-ghost theme-toggle"
          onClick={() => setTheme(nextTheme)}
          aria-label={t('header.themeToggle', { theme: t(`themes.${nextTheme}`) })}
        >
          {theme === 'light' ? '🌙' : '☀️'} {t(`themes.${nextTheme}`)}
        </button>
        <button type="button" className="btn btn-ghost" onClick={logout}>
          Salir
        </button>
      </div>
    </header>
  )
}

export default Header
