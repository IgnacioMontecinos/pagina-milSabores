import { useSearchParams } from 'react-router-dom'
import { money } from '../datos'
import { useTienda } from '../useTienda'

function DetalleProductoAdmin() {
  const [params] = useSearchParams()
  const { productos } = useTienda()

  const id = Number(params.get('id'))
  const p = productos.find((x) => x.id === id)

  if (!p) return <p>Producto no encontrado.</p>

  return (
    <>
      <h1>{p.nombre}</h1>
      <p><b>Código:</b> {p.codigo}</p>
      <p><b>Descripción:</b> {p.descripcion}</p>
      <p><b>Precio:</b> {money(p.precio)}</p>
      <p><b>Stock:</b> {p.stock}</p>
      <p><b>Stock crítico:</b> {p.critico || 'No definido'}</p>
      <p><b>Categoría:</b> {p.categoria}</p>
    </>
  )
}

export default DetalleProductoAdmin
