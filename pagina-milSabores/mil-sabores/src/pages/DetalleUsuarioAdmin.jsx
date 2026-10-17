import { useSearchParams } from 'react-router-dom'
import { useTienda } from '../useTienda'

function DetalleUsuarioAdmin() {
  const [params] = useSearchParams()
  const { usuarios } = useTienda()

  const id = Number(params.get('id'))
  const u = usuarios.find((x) => x.id === id)

  if (!u) return <p>Usuario no encontrado.</p>

  return (
    <>
      <h1>{u.nombre} {u.apellidos}</h1>
      <p><b>RUN:</b> {u.run || '-'}</p>
      <p><b>Correo:</b> {u.correo}</p>
      <p><b>Rol:</b> {u.rol}</p>
      <p><b>Región:</b> {u.region || '-'}</p>
      <p><b>Comuna:</b> {u.comuna || '-'}</p>
      <p><b>Dirección:</b> {u.direccion || '-'}</p>
    </>
  )
}

export default DetalleUsuarioAdmin
