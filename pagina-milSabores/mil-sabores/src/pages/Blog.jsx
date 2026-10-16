function Blog() {
  return (
    <>
      <h1>Noticias y consejos</h1>

      <article className="blog">
        <div>
          <h2>¿Cómo elegir la torta perfecta?</h2>
          <p>Conoce algunos consejos para elegir una torta para cada ocasión.</p>
          <a className="btn" href="blog1.html">Ver artículo</a>
        </div>
        <img src="/blog1.jpg" alt="Tortas" />
      </article>

      <article className="blog">
        <img src="/blog2.jpg" alt="Pastelería" />
        <div>
          <h2>El secreto de nuestros sabores</h2>
          <p>Descubre cómo elaboramos nuestros productos artesanales.</p>
          <a className="btn" href="blog2.html">Ver artículo</a>
        </div>
      </article>
    </>
  )
}

export default Blog
