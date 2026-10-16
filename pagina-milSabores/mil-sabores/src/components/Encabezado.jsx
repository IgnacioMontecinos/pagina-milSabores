import BarraNavegacion from './BarraNavegacion'

function Encabezado({ esAdmin = false }) {
  return (
    <header id="header">
      <div className="top">
        <a className="brand" href="index.html">
          <img src="/logo.png" alt="Logo" />
          Mil Sabores
        </a>
        <BarraNavegacion esAdmin={esAdmin} />
      </div>
    </header>
  )
}

export default Encabezado
