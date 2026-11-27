function DetalleBlog({ numero = 1 }) {
  if (numero === 2) {
    return (
      <>
        <h1>Esmalte, látex o barniz: cuándo usar cada acabado</h1>
        <img src="/images/pintura.svg" alt="Pinturas y acabados" />
        <p>
          El esmalte es ideal para metales y maderas que requieren brillo y resistencia;
          el látex facilita el lavado en muros interiores y el barniz protege la veta
          natural de la madera. En Ferretería Los Maestros te ayudamos a elegir
          según la superficie y el uso.
        </p>
      </>
    )
  }

  return (
    <>
      <h1>Cómo elegir el taladro adecuado para tu obra</h1>
      <img src="/images/taladro.svg" alt="Taladro" />
      <p>
        Considera la potencia del motor, el sistema de mandril y si necesitas
        percusión para concreto. Para trabajos continuos, prioriza baterías de
        litio y control de velocidad. Consulta a nuestros maestros antes de comprar.
      </p>
    </>
  )
}

export default DetalleBlog
