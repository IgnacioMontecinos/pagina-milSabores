import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { REGIONES, emailOK, validarRun } from '../datos'
import { useTienda } from '../useTienda'

function FormularioUsuario({ admin = false }) {
  const { usuarios, guardarUsuario } = useTienda()
  const [params] = useSearchParams()
  const navigate = useNavigate()

  const id = Number(params.get('id'))
  const u = admin ? usuarios.find((x) => x.id === id) : null

  const [form, setForm] = useState({
    run: u?.run || '',
    nombre: u?.nombre || '',
    apellidos: u?.apellidos || '',
    correo: u?.correo || '',
    password: u?.password || '',
    fecha: u?.fecha || '',
    rol: u?.rol || 'Cliente',
    region: u?.region || '',
    comuna: u?.comuna || '',
    direccion: u?.direccion || '',
  })
  const [msg, setMsg] = useState({ texto: '', ok: false })

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })
  const setRegion = (e) => setForm({ ...form, region: e.target.value, comuna: '' })

  const comunas = REGIONES.find((r) => r.n === form.region)?.c || []

  const onSubmit = (e) => {
    e.preventDefault()

    const data = {
      id: u?.id || Date.now(),
      run: form.run.trim().toUpperCase(),
      nombre: form.nombre.trim(),
      apellidos: form.apellidos.trim(),
      correo: form.correo.trim(),
      password: form.password,
      fecha: form.fecha,
      rol: admin ? form.rol : 'Cliente',
      region: form.region,
      comuna: form.comuna,
      direccion: form.direccion.trim(),
    }

    if (!validarRun(data.run)) return setMsg({ texto: 'RUN inválido', ok: false })
    if (!data.nombre) return setMsg({ texto: 'El nombre es obligatorio', ok: false })
    if (!data.apellidos) return setMsg({ texto: 'Los apellidos son obligatorios', ok: false })
    if (!emailOK(data.correo)) return setMsg({ texto: 'Correo no permitido', ok: false })
    if (data.password.length < 4 || data.password.length > 10) {
      return setMsg({ texto: 'Contraseña entre 4 y 10 caracteres', ok: false })
    }
    if (!data.direccion) return setMsg({ texto: 'La dirección es obligatoria', ok: false })
    if (!admin) {
      if (!data.region) return setMsg({ texto: 'Debe seleccionar una región', ok: false })
      if (!data.comuna) return setMsg({ texto: 'Debe seleccionar una comuna', ok: false })
    }

    guardarUsuario(data)

    if (admin) {
      navigate('/admin/usuarios')
    } else {
      setMsg({ texto: 'Registro exitoso', ok: true })
      setForm({ run: '', nombre: '', apellidos: '', correo: '', password: '', fecha: '', rol: 'Cliente', region: '', comuna: '', direccion: '' })
    }
  }

  return (
    <>
      <h1>{admin ? (u ? 'Editar usuario' : 'Nuevo usuario') : 'Registro de usuario'}</h1>
      <form id="userForm" onSubmit={onSubmit}>
        <label>RUN sin puntos ni guion</label>
        <input id="run" maxLength={9} value={form.run} onChange={set('run')} />
        <label>Nombre</label>
        <input id="nombre" maxLength={50} value={form.nombre} onChange={set('nombre')} />
        <label>Apellidos</label>
        <input id="apellidos" maxLength={100} value={form.apellidos} onChange={set('apellidos')} />
        <label>Correo</label>
        <input id="correo" maxLength={100} value={form.correo} onChange={set('correo')} />
        <label>Contraseña</label>
        <input id="password" type="password" maxLength={10} value={form.password} onChange={set('password')} />
        <label>Fecha de nacimiento</label>
        <input id="fecha" type="date" value={form.fecha} onChange={set('fecha')} />
        {admin && (
          <>
            <label>Tipo de usuario</label>
            <select id="rol" value={form.rol} onChange={set('rol')}>
              <option>Administrador</option>
              <option>Cliente</option>
              <option>Vendedor</option>
            </select>
          </>
        )}
        <label>Región</label>
        <select id="region" value={form.region} onChange={setRegion}>
          <option value="">Seleccione</option>
          {REGIONES.map((r) => (
            <option key={r.n}>{r.n}</option>
          ))}
        </select>
        <label>Comuna</label>
        <select id="comuna" value={form.comuna} onChange={set('comuna')}>
          <option value="">Seleccione</option>
          {comunas.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <label>Dirección</label>
        <input id="direccion" maxLength={300} value={form.direccion} onChange={set('direccion')} />
        <button>Guardar</button>
        <p className={msg.ok ? 'msg ok' : 'msg'}>{msg.texto}</p>
      </form>
    </>
  )
}

export default FormularioUsuario
