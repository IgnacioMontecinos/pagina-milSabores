function FormularioProductoAdmin() {
  return (
    <>
      <h1>Nuevo producto</h1>
      <form id="productForm">
        <label>Código</label>
        <input id="codigo" />
        <label>Nombre</label>
        <input id="nombre" maxLength={100} />
        <label>Descripción</label>
        <textarea id="descripcion" maxLength={500}></textarea>
        <label>Precio</label>
        <input id="precio" type="number" min="0" step="0.01" />
        <label>Stock</label>
        <input id="stock" type="number" min="0" step="1" />
        <label>Stock crítico</label>
        <input id="critico" type="number" min="0" step="1" />
        <label>Categoría</label>
        <select id="categoria">
          <option>Tortas</option>
          <option>Pasteles</option>
          <option>Dulces</option>
        </select>
        <label>Ruta imagen (opcional)</label>
        <input id="imagen" placeholder="img/producto.jpg" />
        <button>Guardar</button>
        <p className="msg"></p>
      </form>
    </>
  )
}

export default FormularioProductoAdmin
