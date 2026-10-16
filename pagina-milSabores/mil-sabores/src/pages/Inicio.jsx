function Inicio() {
  return (
    <>
      <section className="hero">
        <div>
          <h1>Pastelería Mil Sabores</h1>
          <p>Tradición, sabor y dulzura en cada preparación.</p>
          <a className="btn" href="productos.html">Ver productos</a>
        </div>
        <img src="/hero-pasteleria.jpg" alt="Pastelería Mil Sabores" />
      </section>

      <h2>Productos destacados</h2>
      <section className="grid">
        <article className="card">
          <a href="producto.html?id=1">
            <img src="/torta-chocolate.jpg" alt="Torta de Chocolate" />
            <h3>Torta de Chocolate</h3>
          </a>
          <p>Torta artesanal de chocolate con suave relleno de crema.</p>
          <p className="price">$18.990</p>
          <button>Añadir al carrito</button>
        </article>

        <article className="card">
          <a href="producto.html?id=2">
            <img src="/torta-frutilla.jpg" alt="Torta de Frutilla" />
            <h3>Torta de Frutilla</h3>
          </a>
          <p>Bizcocho suave con crema y frutillas frescas.</p>
          <p className="price">$19.990</p>
          <button>Añadir al carrito</button>
        </article>

        <article className="card">
          <a href="producto.html?id=3">
            <img src="/cheesecake.jpg" alt="Cheesecake" />
            <h3>Cheesecake</h3>
          </a>
          <p>Cheesecake cremoso con base de galleta.</p>
          <p className="price">$14.990</p>
          <button>Añadir al carrito</button>
        </article>
      </section>
    </>
  )
}

export default Inicio
