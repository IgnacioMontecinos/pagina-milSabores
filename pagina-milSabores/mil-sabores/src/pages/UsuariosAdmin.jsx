import { Link } from 'react-router-dom'

function UsuariosAdmin() {
  return (
    <>
      <h1>Usuarios</h1>
      <p><Link className="btn" to="/admin/usuario-form">Nuevo usuario</Link></p>
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
          <tr>
            <td>-</td>
            <td>Administrador Mil Sabores</td>
            <td>admin@duoc.cl</td>
            <td>Administrador</td>
            <td className="actions">
              <Link className="btn" to="/admin/usuario-ver?id=1">Ver</Link>
              <Link className="btn" to="/admin/usuario-form?id=1">Editar</Link>
              <button>Eliminar</button>
            </td>
          </tr>
          <tr>
            <td>-</td>
            <td>Vendedor Mil Sabores</td>
            <td>vendedor@duoc.cl</td>
            <td>Vendedor</td>
            <td className="actions">
              <Link className="btn" to="/admin/usuario-ver?id=2">Ver</Link>
              <Link className="btn" to="/admin/usuario-form?id=2">Editar</Link>
              <button>Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </>
  )
}

export default UsuariosAdmin
