function Contacto() {
  return (
    <>
      <h1>Contacto</h1>
      <form id="contactForm">
        <label>Nombre</label>
        <input id="nombre" maxLength={100} />
        <label>Correo</label>
        <input id="correo" maxLength={100} />
        <label>Comentario</label>
        <textarea id="comentario" maxLength={500}></textarea>
        <button>Enviar mensaje</button>
        <p className="msg"></p>
      </form>
    </>
  )
}

export default Contacto
