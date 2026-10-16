function DetalleBlog({ numero = 1 }) {
  if (numero === 2) {
    return (
      <>
        <h1>El secreto de nuestros sabores</h1>
        <img src="/blog2.jpg" alt="Pastelería" />
        <p>
          La calidad de una preparación comienza con sus ingredientes. Buscamos
          combinar recetas tradicionales con una presentación atractiva y
          productos frescos.
        </p>
      </>
    )
  }

  return (
    <>
      <h1>¿Cómo elegir la torta perfecta?</h1>
      <img src="/blog1.jpg" alt="Torta" />
      <p>
        Antes de elegir una torta considera la cantidad de invitados, los sabores
        preferidos y el tipo de celebración. En Mil Sabores contamos con distintas
        alternativas para compartir momentos especiales.
      </p>
    </>
  )
}

export default DetalleBlog
