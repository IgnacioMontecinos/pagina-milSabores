import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './AuthContext'
import { TiendaProvider } from './tienda'
import LayoutPrincipal from './layouts/LayoutPrincipal'
import RutaProtegida from './components/RutaProtegida'
import Inicio from './pages/Inicio'
import Productos from './pages/Productos'
import DetalleProducto from './pages/DetalleProducto'
import Nosotros from './pages/Nosotros'
import Blog from './pages/Blog'
import DetalleBlog from './pages/DetalleBlog'
import Contacto from './pages/Contacto'
import LoginPage from './pages/LoginPage'
import Registro from './pages/Registro'
import Carrito from './pages/Carrito'
import AdminPage from './pages/AdminPage'
import FormularioProductoAdmin from './pages/FormularioProductoAdmin'
import DetalleProductoAdmin from './pages/DetalleProductoAdmin'
import UsuariosAdmin from './pages/UsuariosAdmin'
import FormularioUsuarioAdmin from './pages/FormularioUsuarioAdmin'
import DetalleUsuarioAdmin from './pages/DetalleUsuarioAdmin'

function App() {
  return (
    <AuthProvider>
      <TiendaProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<LayoutPrincipal />}>
              <Route path="/" element={<Inicio />} />
              <Route path="/productos" element={<Productos />} />
              <Route path="/producto" element={<DetalleProducto />} />
              <Route path="/nosotros" element={<Nosotros />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/1" element={<DetalleBlog numero={1} />} />
              <Route path="/blog/2" element={<DetalleBlog numero={2} />} />
              <Route path="/contacto" element={<Contacto />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/registro" element={<Registro />} />
              <Route path="/carrito" element={<Carrito />} />

              <Route path="/admin" element={<RutaProtegida><AdminPage /></RutaProtegida>} />
              <Route path="/admin/productos" element={<RutaProtegida><AdminPage /></RutaProtegida>} />
              <Route path="/admin/producto-form" element={<RutaProtegida><FormularioProductoAdmin /></RutaProtegida>} />
              <Route path="/admin/producto-ver" element={<RutaProtegida><DetalleProductoAdmin /></RutaProtegida>} />
              <Route path="/admin/usuarios" element={<RutaProtegida><UsuariosAdmin /></RutaProtegida>} />
              <Route path="/admin/usuario-form" element={<RutaProtegida><FormularioUsuarioAdmin /></RutaProtegida>} />
              <Route path="/admin/usuario-ver" element={<RutaProtegida><DetalleUsuarioAdmin /></RutaProtegida>} />

              <Route path="*" element={<Inicio />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TiendaProvider>
    </AuthProvider>
  )
}

export default App
