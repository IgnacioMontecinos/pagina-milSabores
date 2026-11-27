import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTienda } from '../useTienda'

function LoginPage() {
  const { iniciarSesion } = useTienda()
  const navigate = useNavigate()
  const [msg, setMsg] = useState({ texto: '', ok: false })

  const onSubmit = async (e) => {
    e.preventDefault()
    const usuario = e.target.elements.username.value.trim()
    const pass = e.target.elements.password.value

    if (!usuario) return setMsg({ texto: 'El usuario es obligatorio', ok: false })
    if (pass.length < 6) return setMsg({ texto: 'La contraseña debe tener al menos 6 caracteres', ok: false })

    const r = await iniciarSesion(usuario, pass)
    if (!r.ok) return setMsg({ texto: r.error, ok: false })

    navigate(r.usuario.rol === 'Administrador' ? '/admin' : '/')
  }

  return (
    <>
      <h1>Inicio de sesión</h1>
      <form id="loginForm" onSubmit={onSubmit}>
        <label>Usuario</label>
        <input id="username" name="username" autoComplete="username" maxLength={100} />
        <label>Contraseña</label>
        <input id="password" name="password" type="password" autoComplete="current-password" maxLength={100} />
        <button>Ingresar</button>
        <p className={msg.ok ? 'msg ok' : 'msg'}>{msg.texto}</p>
      </form>
      <section className="credenciales">
        <h2>Credenciales de prueba</h2>
        <p>Cliente: <b>user</b> / <b>User123!</b> (ROLE_USER)</p>
        <p>Administrador: <b>admin</b> / <b>Admin123!</b> (ROLE_ADMIN)</p>
      </section>
    </>
  )
}

export default LoginPage
