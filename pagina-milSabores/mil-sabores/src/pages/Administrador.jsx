import { useTienda } from '../useTienda'

function Administrador() {
  const { productos, usuarios, sesion } = useTienda()

  return (
    <>
      <h1>Hola, {sesion?.nombre}</h1>
      <p>Panel de administración de Pastelería Mil Sabores.</p>
      <section className="admin-boxes">
        <div className="admin-box">
          <h2>{productos.length}</h2>
          <p>Productos</p>
        </div>
        {sesion?.rol === 'Administrador' && (
          <div className="admin-box">
            <h2>{usuarios.length}</h2>
            <p>Usuarios</p>
          </div>
        )}
      </section>
    </>
  )
}

export default Administrador
