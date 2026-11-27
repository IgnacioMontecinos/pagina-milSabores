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
    if (c && !emailOK(c)) return setMsg({ texto: 'Ingrese un correo válido', ok: false })
    if (!t) return setMsg({ texto: 'La consulta es obligatoria', ok: false })

    setMsg({ texto: 'Consulta enviada. Te contactaremos con tu cotización.', ok: true })
    e.target.reset()
  }

  return (
    <>
      <h1>Contacto y cotizaciones</h1>
      <p>Solicita presupuestos para obras, reparaciones o asesoría técnica.</p>
      <form id="contactForm" onSubmit={onSubmit}>
        <label>Nombre</label>
        <input id="nombre" name="nombre" maxLength={100} />
        <label>Correo</label>
        <input id="correo" name="correo" maxLength={100} />
        <label>Tipo de consulta</label>
        <select id="tipoConsulta" name="tipoConsulta">
          <option>Cotización</option>
          <option>Asesoría técnica</option>
        </select>
        <label>Consulta</label>
        <textarea id="comentario" name="comentario" maxLength={500}></textarea>
        <button>Enviar consulta</button>
        <p className={msg.ok ? 'msg ok' : 'msg'}>{msg.texto}</p>
      </form>
    </>
  )
}

export default Contacto
