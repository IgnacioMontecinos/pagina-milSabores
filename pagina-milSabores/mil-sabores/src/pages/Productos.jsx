import { Link } from 'react-router-dom'

function Productos() {
  return (
    <>
      <h1>Nuestros productos</h1>
      <section className="grid">
        <article className="card">
          <Link to="/producto?id=1">
            <img src="/torta-chocolate.jpg" alt="Torta de Chocolate" />
            <h3>Torta de Chocolate</h3>
          </Link>
          <p>Torta artesanal de chocolate con suave relleno de crema.</p>
          <p className="price">$18.990</p>
          <button>Añadir al carrito</button>
        </article>

        <article className="card">
          <Link to="/producto?id=2">
            <img src="/torta-frutilla.jpg" alt="Torta de Frutilla" />
            <h3>Torta de Frutilla</h3>
          </Link>
          <p>Bizcocho suave con crema y frutillas frescas.</p>
          <p className="price">$19.990</p>
          <button>Añadir al carrito</button>
        </article>

        <article className="card">
          <Link to="/producto?id=3">
            <img src="/cheesecake.jpg" alt="Cheesecake" />
            <h3>Cheesecake</h3>
          </Link>
          <p>Cheesecake cremoso con base de galleta.</p>
          <p className="price">$14.990</p>
          <button>Añadir al carrito</button>
        </article>

        <article className="card">
          <Link to="/producto?id=4">
            <img src="/pie-limon.jpg" alt="Pie de Limón" />
            <h3>Pie de Limón</h3>
          </Link>
          <p>Pie artesanal con crema de limón y merengue.</p>
          <p className="price">$12.990</p>
          <button>Añadir al carrito</button>
        </article>

        <article className="card">
          <Link to="/producto?id=5">
            <img src="/cupcakes.jpg" alt="Cupcakes" />
            <h3>Cupcakes</h3>
          </Link>
          <p>Caja de seis cupcakes decorados.</p>
          <p className="price">$9.990</p>
          <button>Añadir al carrito</button>
        </article>

        <article className="card">
          <Link to="/producto?id=6">
            <img src="/alfajores.jpg" alt="Alfajores" />
            <h3>Alfajores</h3>
          </Link>
          <p>Caja de alfajores rellenos con manjar.</p>
          <p className="price">$7.990</p>
          <button>Añadir al carrito</button>
        </article>
      </section>
    </>
  )
}

export default Productos
