function BarraNavegacion({ esAdmin = false }) {
  if (esAdmin) {
    return (
      <nav>
        <a href="index.html">Inicio</a>
        <a href="productos.html">Productos</a>
        <a href="usuarios.html">Usuarios</a>
        <a href="../index.html">Tienda</a>
        <button>Salir</button>
      </nav>
    )
  }

  return (
    <nav>
      <a href="index.html">Inicio</a>
      <a href="productos.html">Productos</a>
      <a href="nosotros.html">Nosotros</a>
      <a href="blog.html">Blog</a>
      <a href="contacto.html">Contacto</a>
      <a href="login.html">Ingresar</a>
      <a href="carrito.html">
        🛒 (<span id="cartCount">0</span>)
      </a>
    </nav>
  )
}

export default BarraNavegacion
