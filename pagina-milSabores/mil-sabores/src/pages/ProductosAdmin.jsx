function ProductosAdmin() {
  return (
    <>
      <h1>Productos</h1>
      <p><a className="btn" href="producto-form.html">Nuevo producto</a></p>
      <table>
        <thead>
          <tr>
            <th>Código</th>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>TOR001</td>
            <td>Torta de Chocolate</td>
            <td>$18.990</td>
            <td>12</td>
            <td className="actions">
              <a className="btn" href="producto-ver.html?id=1">Ver</a>
              <a className="btn" href="producto-form.html?id=1">Editar</a>
              <button>Eliminar</button>
            </td>
          </tr>
          <tr>
            <td>TOR002</td>
            <td>Torta de Frutilla</td>
            <td>$19.990</td>
            <td>8</td>
            <td className="actions">
              <a className="btn" href="producto-ver.html?id=2">Ver</a>
              <a className="btn" href="producto-form.html?id=2">Editar</a>
              <button>Eliminar</button>
            </td>
          </tr>
          <tr>
            <td>PAS001</td>
            <td>Cheesecake</td>
            <td>$14.990</td>
            <td>9</td>
            <td className="actions">
              <a className="btn" href="producto-ver.html?id=3">Ver</a>
              <a className="btn" href="producto-form.html?id=3">Editar</a>
              <button>Eliminar</button>
            </td>
          </tr>
          <tr>
            <td>PAS002</td>
            <td>Pie de Limón</td>
            <td>$12.990</td>
            <td>15</td>
            <td className="actions">
              <a className="btn" href="producto-ver.html?id=4">Ver</a>
              <a className="btn" href="producto-form.html?id=4">Editar</a>
              <button>Eliminar</button>
            </td>
          </tr>
          <tr>
            <td>DUL001</td>
            <td>Cupcakes</td>
            <td>$9.990</td>
            <td>20</td>
            <td className="actions">
              <a className="btn" href="producto-ver.html?id=5">Ver</a>
              <a className="btn" href="producto-form.html?id=5">Editar</a>
              <button>Eliminar</button>
            </td>
          </tr>
          <tr>
            <td>DUL002</td>
            <td>Alfajores</td>
            <td>$7.990</td>
            <td>25</td>
            <td className="actions">
              <a className="btn" href="producto-ver.html?id=6">Ver</a>
              <a className="btn" href="producto-form.html?id=6">Editar</a>
              <button>Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </>
  )
}

export default ProductosAdmin
