import { Link, useSearchParams } from 'react-router-dom'
import { money } from '../datos'
import { useTienda } from '../useTienda'

function DetalleProducto() {
  const [params] = useSearchParams()
  const { productos, agregarAlCarrito } = useTienda()

  const id = Number(params.get('id'))
  const p = productos.find((x) => x.id === id) || productos[0]

  if (!p) return <p>Producto no encontrado.</p>

  const relacionados = productos.filter((x) => x.id !== p.id).slice(0, 3)

  return (
    <>
      <section className="hero">
        <img src={p.img} alt={p.nombre} />
        <div>
          <h1>{p.nombre}</h1>
          <p>{p.descripcion}</p>
          <p><b>Categoría:</b> {p.categoria}</p>
          <p className="price">{money(p.precio)}</p>
          <p>Stock disponible: {p.stock}</p>
          <button onClick={() => agregarAlCarrito(p.id)}>Añadir al carrito</button>
        </div>
      </section>

      <h2>También te puede gustar</h2>
      <section className="grid">
        {relacionados.map((x) => (
          <article className="card" key={x.id}>
            <Link to={`/producto?id=${x.id}`}>
              <img src={x.img} alt={x.nombre} />
              <h3>{x.nombre}</h3>
            </Link>
            <p>{x.descripcion}</p>
            <p className="price">{money(x.precio)}</p>
            <button onClick={() => agregarAlCarrito(x.id)}>Añadir al carrito</button>
          </article>
        ))}
      </section>
    </>
  )
}

export default DetalleProducto
