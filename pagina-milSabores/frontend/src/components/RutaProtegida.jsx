import { Navigate } from 'react-router-dom'
import { useTienda } from '../useTienda'
import { useAuth } from '../contextoAuth'

function RutaProtegida({ children }) {
  const { sesion } = useTienda()
  const auth = useAuth()

  if (auth?.cargando) return null

  const autoridades = auth?.usuario?.authorities || sesion?.authorities || []
  const esAdmin = auth
    ? auth.esAdmin
    : autoridades.includes('ROLE_ADMIN') || sesion?.rol === 'Administrador'

  if (!esAdmin) return <Navigate to="/login" replace />

  return children
}

export default RutaProtegida
