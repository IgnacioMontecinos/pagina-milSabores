import { Link } from 'react-router-dom'

function BarraNavegacion({ esAdmin = false }) {
  if (esAdmin) {
    return (
      <nav>
        <Link to="/admin">Inicio</Link>
        <Link to="/admin/productos">Productos</Link>
        <Link to="/admin/usuarios">Usuarios</Link>
        <Link to="/">Tienda</Link>
        <Link to="/login">Salir</Link>
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
        🛒 (<span id="cartCount">0</span>)
      </Link>
    </nav>
  )
}

export default BarraNavegacion
