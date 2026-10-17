import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { emailOK } from '../datos'
import { useTienda } from '../useTienda'

function InicioSesion() {
  const { iniciarSesion } = useTienda()
  const navigate = useNavigate()
  const [msg, setMsg] = useState({ texto: '', ok: false })

  const onSubmit = (e) => {
    e.preventDefault()
    const correo = e.target.elements.correo.value.trim()
    const pass = e.target.elements.password.value

    if (!emailOK(correo)) {
      return setMsg({ texto: 'Ingrese un correo @duoc.cl, @profesor.duoc.cl o @gmail.com', ok: false })
    }
    if (pass.length < 4 || pass.length > 10) {
      return setMsg({ texto: 'La contraseña debe tener entre 4 y 10 caracteres', ok: false })
    }

    const r = iniciarSesion(correo, pass)
    if (!r.ok) return setMsg({ texto: r.error, ok: false })

    navigate(r.usuario.rol === 'Administrador' || r.usuario.rol === 'Vendedor' ? '/admin' : '/')
  }

  return (
    <>
      <h1>Inicio de sesión</h1>
      <form id="loginForm" onSubmit={onSubmit}>
        <label>Correo</label>
        <input id="correo" name="correo" maxLength={100} />
        <label>Contraseña</label>
        <input id="password" name="password" type="password" maxLength={10} />
        <button>Ingresar</button>
        <p className={msg.ok ? 'msg ok' : 'msg'}>{msg.texto}</p>
        <p><small>Administrador demo: admin@duoc.cl / 1234</small></p>
      </form>
    </>
  )
}

export default InicioSesion
