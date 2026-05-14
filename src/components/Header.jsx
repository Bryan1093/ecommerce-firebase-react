import { NavLink } from 'react-router-dom'

function Header() {
  const navLinkClass = ({ isActive }) => (isActive ? 'nav-link nav-link-active' : 'nav-link')

  return (
    <header className="site-header">
      <h1 className="brand">
        <span className="brand-badge">MT</span>
        Mi Tienda
      </h1>
      <nav aria-label="Navegación principal">
        <ul className="nav-links">
          <li>
            <NavLink to="/" className={navLinkClass}>
              Inicio
            </NavLink>
          </li>
          <li>
            <NavLink to="/productos" className={navLinkClass}>
              Productos
            </NavLink>
          </li>
          <li>
            <NavLink to="/carrito" className={navLinkClass}>
              Carrito
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  )
}

export default Header
