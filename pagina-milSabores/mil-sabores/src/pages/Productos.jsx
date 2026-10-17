import { Link } from 'react-router-dom'
import { money } from '../datos'
import { useTienda } from '../useTienda'

function Productos() {
  const { productos, agregarAlCarrito } = useTienda()

  return (
    <>
      <h1>Nuestros productos</h1>
      <section className="grid">
        {productos.map((p) => (
          <article className="card" key={p.id}>
            <Link to={`/producto?id=${p.id}`}>
              <img src={p.img} alt={p.nombre} />
              <h3>{p.nombre}</h3>
            </Link>
            <p>{p.descripcion}</p>
            <p className="price">{money(p.precio)}</p>
            <button onClick={() => agregarAlCarrito(p.id)}>Añadir al carrito</button>
          </article>
        ))}
      </section>
    </>
  )
}

export default Productos
