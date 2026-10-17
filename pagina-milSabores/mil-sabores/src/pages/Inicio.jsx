import { Link } from 'react-router-dom'
import { money } from '../datos'
import { useTienda } from '../useTienda'

function Inicio() {
  const { productos, agregarAlCarrito } = useTienda()

  return (
    <>
      <section className="hero">
        <div>
          <h1>Pastelería Mil Sabores</h1>
          <p>Tradición, sabor y dulzura en cada preparación.</p>
          <Link className="btn" to="/productos">Ver productos</Link>
        </div>
        <img src="/hero-pasteleria.jpg" alt="Pastelería Mil Sabores" />
      </section>

      <h2>Productos destacados</h2>
      <section className="grid">
        {productos.slice(0, 3).map((p) => (
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

export default Inicio
