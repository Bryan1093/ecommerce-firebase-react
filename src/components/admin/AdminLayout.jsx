import { NavLink } from 'react-router-dom'

function AdminLayout({ eyebrow, title, breadcrumbs, actions, children }) {
  const linkClass = ({ isActive }) =>
    isActive ? 'admin-nav-link admin-nav-link-active' : 'admin-nav-link'

  return (
    <section className="admin-shell">
      <aside className="admin-sidebar" aria-label="Menú del panel">
        <h2>Panel</h2>
        <nav>
          <NavLink to="/productos" className={linkClass}>
            Catálogo
          </NavLink>
          <NavLink to="/productos/nuevo" className={linkClass}>
            Agregar producto
          </NavLink>
          <NavLink to="/" className={linkClass}>
            Ver tienda
          </NavLink>
        </nav>
      </aside>

      <div className="admin-content">
        <div className="admin-breadcrumbs" aria-label="Breadcrumbs">
          {breadcrumbs.map((crumb, index) => (
            <span key={crumb}>
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
          <div className="admin-header-actions">{actions}</div>
        </header>

        {children}
      </div>
    </section>
  )
}

export default AdminLayout
