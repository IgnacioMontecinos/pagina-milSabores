function FormularioUsuarioAdmin() {
  return (
    <>
      <h1>Nuevo usuario</h1>
      <form id="userForm">
        <label>RUN sin puntos ni guion</label>
        <input id="run" maxLength={9} />
        <label>Nombre</label>
        <input id="nombre" maxLength={50} />
        <label>Apellidos</label>
        <input id="apellidos" maxLength={100} />
        <label>Correo</label>
        <input id="correo" maxLength={100} />
        <label>Contraseña</label>
        <input id="password" type="password" maxLength={10} />
        <label>Fecha de nacimiento</label>
        <input id="fecha" type="date" />
        <label>Tipo de usuario</label>
        <select id="rol">
          <option>Administrador</option>
          <option>Cliente</option>
          <option>Vendedor</option>
        </select>
        <label>Región</label>
        <select id="region">
          <option value="">Seleccione</option>
          <option>Metropolitana de Santiago</option>
          <option>Valparaíso</option>
          <option>Biobío</option>
        </select>
        <label>Comuna</label>
        <select id="comuna">
          <option value="">Seleccione</option>
        </select>
        <label>Dirección</label>
        <input id="direccion" maxLength={300} />
        <button>Guardar</button>
        <p className="msg"></p>
      </form>
    </>
  )
}

export default FormularioUsuarioAdmin
