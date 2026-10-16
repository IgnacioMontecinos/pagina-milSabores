import { Link } from 'react-router-dom'

function Blog() {
  return (
    <>
      <h1>Noticias y consejos</h1>

      <article className="blog">
        <div>
          <h2>¿Cómo elegir la torta perfecta?</h2>
          <p>Conoce algunos consejos para elegir una torta para cada ocasión.</p>
          <Link className="btn" to="/blog/1">Ver artículo</Link>
        </div>
        <img src="/blog1.jpg" alt="Tortas" />
      </article>

      <article className="blog">
        <img src="/blog2.jpg" alt="Pastelería" />
        <div>
          <h2>El secreto de nuestros sabores</h2>
          <p>Descubre cómo elaboramos nuestros productos artesanales.</p>
          <Link className="btn" to="/blog/2">Ver artículo</Link>
        </div>
      </article>
    </>
  )
}

export default Blog
