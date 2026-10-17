import { Link, useNavigate } from 'react-router-dom'
import { useTienda } from '../useTienda'

function BarraNavegacion({ esAdmin = false }) {
  const { sesion, cantidadCarrito, cerrarSesion } = useTienda()
  const navigate = useNavigate()

  if (esAdmin) {
    const salir = () => {
      cerrarSesion()
      navigate('/login')
    }

    return (
      <nav>
        <Link to="/admin">Inicio</Link>
        <Link to="/admin/productos">Productos</Link>
        {sesion?.rol === 'Administrador' && <Link to="/admin/usuarios">Usuarios</Link>}
        <Link to="/">Tienda</Link>
        <button onClick={salir}>Salir</button>
      </nav>
    )
  }

  return (
    <nav>
      <Link to="/">Inicio</Link>
      <Link to="/productos">Productos</Link>
      <Link to="/nosotros">Nosotros</Link>
      <Link to="/blog">Blog</Link>
      <Link to="/contacto">Contacto</Link>
      <Link to="/login">Ingresar</Link>
      <Link to="/carrito">
        🛒 ({cantidadCarrito})
      </Link>
    </nav>
  )
}

export default BarraNavegacion
