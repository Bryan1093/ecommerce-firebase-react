import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Login() {
  const navigate = useNavigate()
  const { loginAs } = useAuth()

  const handleLogin = (role) => {
    loginAs(role)
    navigate(role === 'admin' ? '/admin' : '/cuenta')
  }

  return (
    <section className="page-content login-card">
      <p className="eyebrow">Acceso demo</p>
      <h2>Simula roles y valida la separación entre tienda y backoffice</h2>
      <p>
        Este prototipo implementa guards básicos para que el rol administrador acceda al panel y el cliente a su cuenta.
      </p>
      <div className="hero-actions centered-actions">
        <button type="button" className="btn btn-primary" onClick={() => handleLogin('admin')}>
          Entrar como administrador
        </button>
        <button type="button" className="btn btn-ghost" onClick={() => handleLogin('customer')}>
          Entrar como cliente
        </button>
      </div>
    </section>
  )
}

export default Login
