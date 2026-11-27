import { Link } from 'react-router-dom'
import Navbar from './Navbar'

function Header({ esAdmin = false }) {
  return (
    <header id="header">
      <div className="top">
        <Link className="brand" to={esAdmin ? '/admin' : '/'}>
          <img src="/logo-ferreteria.svg" alt="Logo Ferretería Los Maestros" />
          <span>
            <strong>Ferretería Los Maestros</strong>
            <small>Herramientas que trabajan contigo</small>
          </span>
        </Link>
        <Navbar esAdmin={esAdmin} />
      </div>
    </header>
  )
}

export default Header
