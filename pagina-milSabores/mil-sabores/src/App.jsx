import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Encabezado from './components/Encabezado'
import PiePagina from './components/PiePagina'
import Inicio from './pages/Inicio'
import Productos from './pages/Productos'
import DetalleProducto from './pages/DetalleProducto'
import Nosotros from './pages/Nosotros'
import Blog from './pages/Blog'
import DetalleBlog from './pages/DetalleBlog'
import Contacto from './pages/Contacto'
import InicioSesion from './pages/InicioSesion'
import Registro from './pages/Registro'
import Carrito from './pages/Carrito'
import Administrador from './pages/Administrador'
import ProductosAdmin from './pages/ProductosAdmin'
import FormularioProductoAdmin from './pages/FormularioProductoAdmin'
import DetalleProductoAdmin from './pages/DetalleProductoAdmin'
import UsuariosAdmin from './pages/UsuariosAdmin'
import FormularioUsuarioAdmin from './pages/FormularioUsuarioAdmin'
import DetalleUsuarioAdmin from './pages/DetalleUsuarioAdmin'

function Layout() {
  const { pathname } = useLocation()
  const esAdmin = pathname.startsWith('/admin')

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <>
      <Encabezado esAdmin={esAdmin} />
      <main id="app">
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/producto" element={<DetalleProducto />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/1" element={<DetalleBlog numero={1} />} />
          <Route path="/blog/2" element={<DetalleBlog numero={2} />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/login" element={<InicioSesion />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/carrito" element={<Carrito />} />

          <Route path="/admin" element={<Administrador />} />
          <Route path="/admin/productos" element={<ProductosAdmin />} />
          <Route path="/admin/producto-form" element={<FormularioProductoAdmin />} />
          <Route path="/admin/producto-ver" element={<DetalleProductoAdmin />} />
          <Route path="/admin/usuarios" element={<UsuariosAdmin />} />
          <Route path="/admin/usuario-form" element={<FormularioUsuarioAdmin />} />
          <Route path="/admin/usuario-ver" element={<DetalleUsuarioAdmin />} />

          <Route path="*" element={<Inicio />} />
        </Routes>
      </main>
      <PiePagina />
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  )
}

export default App
