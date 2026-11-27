import { Link, useNavigate } from 'react-router-dom'
import { useTienda } from '../useTienda'
import { useAuth } from '../contextoAuth'

function Navbar({ esAdmin = false }) {
  const { sesion, cantidadCarrito, cerrarSesion } = useTienda()
  const auth = useAuth()
  const navigate = useNavigate()

  const esAdministrador = auth ? auth.esAdmin : sesion?.rol === 'Administrador'

  const salir = () => {
    cerrarSesion()
    navigate('/login')
  }

  if (esAdmin) {
    return (
      <nav>
        <Link to="/admin">Panel</Link>
        <Link to="/admin/productos">Inventario</Link>
        <Link to="/">Ver tienda</Link>
        <button onClick={salir}>Salir</button>
      </nav>
    )
  }

  return (
    <nav>
      <Link to="/">Inicio</Link>
      <Link to="/productos">Productos</Link>
      <Link to="/contacto">Contacto</Link>
      {auth?.autenticado || sesion ? (
        <>
          {esAdministrador && <Link to="/admin">Administración</Link>}
          <button onClick={salir}>Salir</button>
        </>
      ) : (
        <Link to="/login">Ingresar</Link>
      )}
      <Link to="/carrito">Carrito ({cantidadCarrito})</Link>
    </nav>
  )
}

export default Navbar
