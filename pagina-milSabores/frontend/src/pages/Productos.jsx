import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CATEGORIAS, money } from '../datos'
import { useTienda } from '../useTienda'
import ImagenProducto from '../components/ImagenProducto'

function Productos() {
  const { productos, agregarAlCarrito } = useTienda()
  const [busqueda, setBusqueda] = useState('')
  const [categoria, setCategoria] = useState('Todas')

  const visibles = useMemo(() => {
    const texto = busqueda.trim().toLowerCase()
    return productos.filter((p) => {
      const coincideTexto = !texto ||
        [p.nombre, p.descripcion, p.codigo, p.categoria].some((valor) =>
          String(valor || '').toLowerCase().includes(texto),
        )
      const coincideCategoria = categoria === 'Todas' || p.categoria === categoria
      return coincideTexto && coincideCategoria
    })
  }, [productos, busqueda, categoria])

  return (
    <>
      <h1>Catálogo de herramientas</h1>
      <section className="filtros">
        <label htmlFor="busqueda">Buscar</label>
        <input
          id="busqueda"
          type="search"
          placeholder="Buscar martillos, serruchos, taladros, pinturas..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <label htmlFor="categoria">Categoría</label>
        <select id="categoria" value={categoria} onChange={(e) => setCategoria(e.target.value)}>
          <option>Todas</option>
          {CATEGORIAS.map((c) => <option key={c}>{c}</option>)}
        </select>
        <p>{visibles.length} producto(s)</p>
      </section>

      <section className="grid">
        {visibles.map((p) => (
          <article className="card" key={p.id}>
            <Link to={`/producto?id=${p.id}`}>
              <ImagenProducto producto={p} />
              <h3>{p.nombre}</h3>
            </Link>
            <p>{p.descripcion}</p>
            <p className="price">{money(p.precio)}</p>
            <p>Stock: {p.stock}</p>
            <button onClick={() => agregarAlCarrito(p.id)}>Añadir al carrito</button>
          </article>
        ))}
      </section>
      {!visibles.length && <p>No se encontraron herramientas con esos filtros.</p>}
    </>
  )
}

export default Productos
