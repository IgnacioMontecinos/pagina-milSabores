import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { TiendaProvider } from './tienda'
import Encabezado from './components/Encabezado'
import PiePagina from './components/PiePagina'
import RutaProtegida from './components/RutaProtegida'
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

          <Route path="/admin" element={<RutaProtegida><Administrador /></RutaProtegida>} />
          <Route path="/admin/productos" element={<RutaProtegida><ProductosAdmin /></RutaProtegida>} />
          <Route path="/admin/producto-form" element={<RutaProtegida><FormularioProductoAdmin /></RutaProtegida>} />
          <Route path="/admin/producto-ver" element={<RutaProtegida><DetalleProductoAdmin /></RutaProtegida>} />
          <Route path="/admin/usuarios" element={<RutaProtegida><UsuariosAdmin /></RutaProtegida>} />
          <Route path="/admin/usuario-form" element={<RutaProtegida><FormularioUsuarioAdmin /></RutaProtegida>} />
          <Route path="/admin/usuario-ver" element={<RutaProtegida><DetalleUsuarioAdmin /></RutaProtegida>} />

          <Route path="*" element={<Inicio />} />
        </Routes>
      </main>
      <PiePagina />
    </>
  )
}

function App() {
  return (
    <TiendaProvider>
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </TiendaProvider>
  )
}

export default App
