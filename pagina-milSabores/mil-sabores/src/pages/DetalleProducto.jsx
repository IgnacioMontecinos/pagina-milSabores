import { Link } from 'react-router-dom'

function DetalleProducto() {
  return (
    <>
      <section className="hero">
        <img src="/torta-chocolate.jpg" alt="Torta de Chocolate" />
        <div>
          <h1>Torta de Chocolate</h1>
          <p>Torta artesanal de chocolate con suave relleno de crema.</p>
          <p><b>Categoría:</b> Tortas</p>
          <p className="price">$18.990</p>
          <p>Stock disponible: 12</p>
          <button>Añadir al carrito</button>
        </div>
      </section>

      <h2>También te puede gustar</h2>
      <section className="grid">
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
      </section>
    </>
  )
}

export default DetalleProducto
