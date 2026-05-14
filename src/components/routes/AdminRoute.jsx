import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function AdminRoute() {
  const { isAdmin } = useAuth()
  const location = useLocation()

  if (!isAdmin) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return <Outlet />
}

export default AdminRoute
