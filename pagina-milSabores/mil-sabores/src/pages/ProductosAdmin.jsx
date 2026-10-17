import { Link } from 'react-router-dom'
import { money } from '../datos'
import { useTienda } from '../useTienda'

function ProductosAdmin() {
  const { productos, sesion, eliminarProducto } = useTienda()
  const admin = sesion?.rol === 'Administrador'

  const eliminar = (id) => {
    if (confirm('¿Eliminar producto?')) eliminarProducto(id)
  }

  return (
    <>
      <h1>Productos</h1>
      {admin && (
        <p><Link className="btn" to="/admin/producto-form">Nuevo producto</Link></p>
      )}
      <table>
        <thead>
          <tr>
            <th>Código</th>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((p) => (
            <tr key={p.id}>
              <td>{p.codigo}</td>
              <td>{p.nombre}</td>
              <td>{money(p.precio)}</td>
              <td>{p.stock}{p.critico !== '' && p.stock <= p.critico ? ' ⚠️' : ''}</td>
              <td className="actions">
                <Link className="btn" to={`/admin/producto-ver?id=${p.id}`}>Ver</Link>
                {admin && (
                  <>
                    <Link className="btn" to={`/admin/producto-form?id=${p.id}`}>Editar</Link>
                    <button onClick={() => eliminar(p.id)}>Eliminar</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

export default ProductosAdmin
