import { NavLink } from 'react-router-dom'

function Header() {
  return (
    <header className="site-header">
      <h1 className="brand">Mi Tienda</h1>
      <nav aria-label="Navegación principal">
        <ul className="nav-links">
          <li>
            <NavLink to="/">Inicio</NavLink>
          </li>
          <li>
            <NavLink to="/productos">Productos</NavLink>
          </li>
          <li>
            <NavLink to="/carrito">Carrito</NavLink>
          </li>
        </ul>
      </nav>
    </header>
  )
}

export default Header
