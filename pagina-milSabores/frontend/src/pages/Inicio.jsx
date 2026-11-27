import { Link } from 'react-router-dom'
import { money } from '../datos'
import { useTienda } from '../useTienda'
import ImagenProducto from '../components/ImagenProducto'
import ferreteria from '../assets/ferreteria.jpg'

function Inicio() {
  const { productos, agregarAlCarrito } = useTienda()

  return (
    <>
      <section className="hero hero-inicio" style={{ '--hero-image': `url(${ferreteria})` }}>
        <div>
          <h1>Ferretería Los Maestros</h1>
          <p>Herramientas, materiales y acabados para cada obra. Precios de maestro, calidad de profesional.</p>
          <Link className="btn" to="/productos">Ver catálogo</Link>
        </div>
      </section>

      <section className="ofertas">
        <h2>Ofertas de la semana</h2>
        <p>Hasta un 30% de descuento en herramientas eléctricas seleccionadas.</p>
      </section>

      <h2>Herramientas destacadas</h2>
      <section className="grid">
        {productos.slice(0, 3).map((p) => (
          <article className="card" key={p.id}>
            <Link to={`/producto?id=${p.id}`}>
              <ImagenProducto producto={p} />
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
