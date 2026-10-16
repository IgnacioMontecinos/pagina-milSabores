function UsuariosAdmin() {
  return (
    <>
      <h1>Usuarios</h1>
      <p><a className="btn" href="usuario-form.html">Nuevo usuario</a></p>
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
              <a className="btn" href="usuario-ver.html?id=1">Ver</a>
              <a className="btn" href="usuario-form.html?id=1">Editar</a>
              <button>Eliminar</button>
            </td>
          </tr>
          <tr>
            <td>-</td>
            <td>Vendedor Mil Sabores</td>
            <td>vendedor@duoc.cl</td>
            <td>Vendedor</td>
            <td className="actions">
              <a className="btn" href="usuario-ver.html?id=2">Ver</a>
              <a className="btn" href="usuario-form.html?id=2">Editar</a>
              <button>Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </>
  )
}

export default UsuariosAdmin
