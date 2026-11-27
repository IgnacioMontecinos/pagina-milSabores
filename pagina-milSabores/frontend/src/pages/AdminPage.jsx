import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { money } from '../datos'
import { useTienda } from '../useTienda'

function AdminPage() {
  const { productos, sesion, eliminarProducto } = useTienda()
  const location = useLocation()
  const [msg, setMsg] = useState(() => (
    location.state?.flash
      ? { texto: location.state.flash, ok: true }
      : { texto: '', ok: false }
  ))
  const [eliminando, setEliminando] = useState(null)

  const eliminar = async (id, nombre) => {
    if (eliminando !== null) return
    if (!confirm(`¿Eliminar "${nombre}" del inventario?`)) return
    setEliminando(id)
    const resultado = await eliminarProducto(id)
    setEliminando(null)
    if (resultado.ok) {
      setMsg({ texto: 'Producto eliminado correctamente.', ok: true })
    } else {
      setMsg({ texto: resultado.error, ok: false })
    }
  }

  return (
    <>
      <h1>Administración de inventario</h1>
      <p>Bienvenido, {sesion?.nombre}. Gestiona herramientas, materiales y acabados.</p>
      {msg.texto && <p className={msg.ok ? 'msg ok' : 'msg'}>{msg.texto}</p>}
      <p><Link className="btn" to="/admin/producto-form">Nueva herramienta</Link></p>

      <section className="admin-boxes">
        <div className="admin-box">
          <h2>{productos.length}</h2>
          <p>Productos</p>
        </div>
        <div className="admin-box">
          <h2>{productos.filter((p) => p.stock <= p.critico).length}</h2>
          <p>Con stock crítico</p>
        </div>
      </section>

      <div className="table-responsive">
        <table>
          <thead>
            <tr>
              <th>Código</th>
              <th>Nombre</th>
              <th>Categoría</th>
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
                <td>{p.categoria}</td>
                <td>{money(p.precio)}</td>
                <td>{p.stock}{p.critico !== '' && p.stock <= p.critico ? ' (crítico)' : ''}</td>
                <td className="actions">
                  <Link className="btn" to={`/admin/producto-ver?id=${p.id}`}>Ver</Link>
                  <Link className="btn" to={`/admin/producto-form?id=${p.id}`}>Editar</Link>
                  <button onClick={() => eliminar(p.id, p.nombre)} disabled={eliminando === p.id}>
                    {eliminando === p.id ? 'Eliminando...' : 'Eliminar'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default AdminPage
