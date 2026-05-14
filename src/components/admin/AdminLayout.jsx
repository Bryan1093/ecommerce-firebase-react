import { NavLink } from 'react-router-dom'
import { usePreferences } from '../../context/PreferencesContext'

function AdminLayout({ eyebrow, title, breadcrumbs, actions, children }) {
  const { t } = usePreferences()
  const linkClass = ({ isActive }) =>
    isActive ? 'admin-nav-link admin-nav-link-active' : 'admin-nav-link'

  return (
    <section className="admin-shell">
      <aside className="admin-sidebar" aria-label={t('navigation.panel')}>
        <h2>{t('navigation.panel')}</h2>
        <nav>
          <NavLink to="/productos" className={linkClass}>
            {t('navigation.products')}
          </NavLink>
          <NavLink to="/productos/nuevo" className={linkClass}>
            {t('navigation.addProduct')}
          </NavLink>
          <NavLink to="/configuracion" className={linkClass}>
            {t('navigation.settings')}
          </NavLink>
          <NavLink to="/" className={linkClass}>
            {t('navigation.viewStore')}
          </NavLink>
        </nav>
      </aside>

      <div className="admin-content">
        <div className="admin-breadcrumbs" aria-label="Breadcrumbs">
          {breadcrumbs.map((crumb, index) => (
            <span key={`${crumb}-${index}`}>
              {crumb}
              {index < breadcrumbs.length - 1 ? ' / ' : ''}
            </span>
          ))}
        </div>

        <header className="admin-header-card">
          <div>
            <p className="eyebrow">{eyebrow}</p>
            <h2>{title}</h2>
          </div>
          {actions ? <div className="admin-header-actions">{actions}</div> : null}
        </header>

        {children}
      </div>
    </section>
  )
}

export default AdminLayout
