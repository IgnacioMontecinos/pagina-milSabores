import { Link } from 'react-router-dom'
import BarraNavegacion from './BarraNavegacion'

function Encabezado({ esAdmin = false }) {
  return (
    <header id="header">
      <div className="top">
        <Link className="brand" to="/">
          <img src="/logo.png" alt="Logo" />
          Mil Sabores
        </Link>
        <BarraNavegacion esAdmin={esAdmin} />
      </div>
    </header>
  )
}

export default Encabezado
