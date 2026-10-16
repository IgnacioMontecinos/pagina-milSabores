function InicioSesion() {
  return (
    <>
      <h1>Inicio de sesión</h1>
      <form id="loginForm">
        <label>Correo</label>
        <input id="correo" maxLength={100} />
        <label>Contraseña</label>
        <input id="password" type="password" maxLength={10} />
        <button>Ingresar</button>
        <p className="msg"></p>
        <p><small>Administrador demo: admin@duoc.cl / 1234</small></p>
      </form>
    </>
  )
}

export default InicioSesion
