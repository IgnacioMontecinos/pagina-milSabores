import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer id="footer">
      <p>© 2026 Ferretería Los Maestros · Herramientas, materiales y soluciones para tu obra.</p>
      <nav>
        <Link to="/productos">Catálogo</Link>
        <Link to="/contacto">Cotizaciones</Link>
        <Link to="/login">Acceso</Link>
      </nav>
    </footer>
  )
}

export default Footer
