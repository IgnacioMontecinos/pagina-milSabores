import { Link, Navigate } from 'react-router-dom'
import { useTienda } from '../useTienda'

function UsuariosAdmin() {
  const { usuarios, sesion, eliminarUsuario } = useTienda()

  if (sesion?.rol !== 'Administrador') return <Navigate to="/admin" replace />

  const eliminar = (id) => {
    if (id <= 2) return alert('Los usuarios de demostración no se eliminan.')
    if (confirm('¿Eliminar usuario?')) eliminarUsuario(id)
  }

  return (
    <>
      <h1>Usuarios</h1>
      <p><Link className="btn" to="/admin/usuario-form">Nuevo usuario</Link></p>
      <div className="table-responsive">
        <table>
          <thead>
            <tr>
              <th>RUN</th>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id}>
                <td>{u.run || '-'}</td>
                <td>{u.nombre} {u.apellidos}</td>
                <td>{u.correo}</td>
                <td>{u.rol}</td>
                <td className="actions">
                  <Link className="btn" to={`/admin/usuario-ver?id=${u.id}`}>Ver</Link>
                  <Link className="btn" to={`/admin/usuario-form?id=${u.id}`}>Editar</Link>
                  <button onClick={() => eliminar(u.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default UsuariosAdmin
