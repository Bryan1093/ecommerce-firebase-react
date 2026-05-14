import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const adminLinks = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/productos', label: 'Productos' },
  { to: '/admin/pedidos', label: 'Pedidos' },
  { to: '/admin/clientes', label: 'Clientes' },
  { to: '/admin/marketing', label: 'Marketing' },
  { to: '/configuracion', label: 'Preferencias' },
]

function AdminLayout({ eyebrow, title, breadcrumbs, actions, children }) {
  const { user } = useAuth()
  const linkClass = ({ isActive }) => (isActive ? 'admin-nav-link admin-nav-link-active' : 'admin-nav-link')

  return (
    <section className="admin-shell">
      <aside className="admin-sidebar" aria-label="Panel administrativo">
        <h2>Backoffice</h2>
        <p className="item-category">{user?.email}</p>
        <nav>
          {adminLinks.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end} className={linkClass}>
              {link.label}
            </NavLink>
          ))}
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
