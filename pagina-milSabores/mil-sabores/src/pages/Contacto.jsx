import { useState } from 'react'
import { emailOK } from '../datos'

function Contacto() {
  const [msg, setMsg] = useState({ texto: '', ok: false })

  const onSubmit = (e) => {
    e.preventDefault()
    const n = e.target.elements.nombre.value.trim()
    const c = e.target.elements.correo.value.trim()
    const t = e.target.elements.comentario.value.trim()

    if (!n) return setMsg({ texto: 'El nombre es obligatorio', ok: false })
    if (c && !emailOK(c)) return setMsg({ texto: 'Correo no permitido', ok: false })
    if (!t) return setMsg({ texto: 'El comentario es obligatorio', ok: false })

    setMsg({ texto: 'Mensaje enviado correctamente', ok: true })
    e.target.reset()
  }

  return (
    <>
      <h1>Contacto</h1>
      <form id="contactForm" onSubmit={onSubmit}>
        <label>Nombre</label>
        <input id="nombre" name="nombre" maxLength={100} />
        <label>Correo</label>
        <input id="correo" name="correo" maxLength={100} />
        <label>Comentario</label>
        <textarea id="comentario" name="comentario" maxLength={500}></textarea>
        <button>Enviar mensaje</button>
        <p className={msg.ok ? 'msg ok' : 'msg'}>{msg.texto}</p>
      </form>
    </>
  )
}

export default Contacto
