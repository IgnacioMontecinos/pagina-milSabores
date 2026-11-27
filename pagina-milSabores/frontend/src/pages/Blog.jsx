import { Link } from 'react-router-dom'

function Blog() {
  return (
    <>
      <h1>Noticias y consejos</h1>

      <article className="blog">
        <div>
          <h2>Cómo elegir el taladro adecuado para tu obra</h2>
          <p>Potencia, mandril y tipo de perforación: la guía para acertar.</p>
          <Link className="btn" to="/blog/1">Ver artículo</Link>
        </div>
        <img src="/images/taladro.svg" alt="Taladro" />
      </article>

      <article className="blog">
        <img src="/images/pintura.svg" alt="Pinturas y acabados" />
        <div>
          <h2>Esmalte, látex o barniz: cuándo usar cada acabado</h2>
          <p>Consejos prácticos para lograr un terminado profesional.</p>
          <Link className="btn" to="/blog/2">Ver artículo</Link>
        </div>
      </article>
    </>
  )
}

export default Blog
