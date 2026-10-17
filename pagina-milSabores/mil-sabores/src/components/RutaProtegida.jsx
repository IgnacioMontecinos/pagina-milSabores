import { Navigate } from 'react-router-dom'
import { useTienda } from '../useTienda'

function RutaProtegida({ children }) {
  const { sesion } = useTienda()
  const esAutorizado = sesion && ['Administrador', 'Vendedor'].includes(sesion.rol)

  if (!esAutorizado) return <Navigate to="/login" replace />

  return children
}

export default RutaProtegida
