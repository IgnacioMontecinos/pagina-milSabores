import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { CATEGORIAS } from '../datos'
import { useTienda } from '../useTienda'

function FormularioProductoAdmin() {
  const { productos, guardarProducto } = useTienda()
  const [params] = useSearchParams()
  const navigate = useNavigate()

  const idParam = params.get('id')
  const esEdicion = Boolean(idParam)
  const id = esEdicion ? Number(idParam) : null
  const p = esEdicion ? productos.find((x) => x.id === id) : undefined

  const [form, setForm] = useState({
    codigo: p?.codigo || '',
    nombre: p?.nombre || '',
    descripcion: p?.descripcion || '',
    precio: p?.precio ?? '',
    stock: p?.stock ?? '',
    critico: p?.critico ?? '',
    categoria: p?.categoria || CATEGORIAS[0],
    imagenUrl: p?.imagenUrl || '',
  })
  const [msg, setMsg] = useState({ texto: '', ok: false })
  const [enviando, setEnviando] = useState(false)

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const onSubmit = async (e) => {
    e.preventDefault()
    if (enviando) return

    if (esEdicion && !Number.isInteger(id)) {
      return setMsg({ texto: 'El producto indicado no es válido', ok: false })
    }

    const x = {
      id: esEdicion ? id : undefined,
      codigo: form.codigo.trim(),
      nombre: form.nombre.trim(),
      descripcion: form.descripcion.trim(),
      precio: Number(form.precio),
      stock: Number(form.stock),
      critico: form.critico === '' ? '' : Number(form.critico),
      categoria: form.categoria,
      imagenUrl: form.imagenUrl.trim() || '/images/herramienta.svg',
    }

    if (x.codigo.length < 3) return setMsg({ texto: 'El código debe tener mínimo 3 caracteres', ok: false })
    if (!x.nombre) return setMsg({ texto: 'El nombre es obligatorio', ok: false })
    if (!(x.precio >= 0)) return setMsg({ texto: 'Precio inválido', ok: false })
    if (!Number.isInteger(x.stock) || x.stock < 0) return setMsg({ texto: 'Stock inválido', ok: false })
    if (x.critico !== '' && (!Number.isInteger(x.critico) || x.critico < 0)) {
      return setMsg({ texto: 'Stock crítico inválido', ok: false })
    }

    setEnviando(true)
    const resultado = await guardarProducto(x, { esEdicion })
    setEnviando(false)

    if (!resultado.ok) return setMsg({ texto: resultado.error, ok: false })

    navigate('/admin/productos', {
      state: { flash: esEdicion ? 'Producto actualizado correctamente.' : 'Producto creado correctamente.' },
    })
  }

  return (
    <>
      <h1>{esEdicion ? 'Editar' : 'Nueva'} herramienta</h1>
      <form id="productForm" onSubmit={onSubmit}>
        <label>Código</label>
        <input id="codigo" value={form.codigo} onChange={set('codigo')} />
        <label>Nombre</label>
        <input id="nombre" maxLength={100} value={form.nombre} onChange={set('nombre')} />
        <label>Descripción</label>
        <textarea id="descripcion" maxLength={500} value={form.descripcion} onChange={set('descripcion')}></textarea>
        <label>Precio</label>
        <input id="precio" type="number" min="0" step="0.01" value={form.precio} onChange={set('precio')} />
        <label>Stock</label>
        <input id="stock" type="number" min="0" step="1" value={form.stock} onChange={set('stock')} />
        <label>Stock crítico</label>
        <input id="critico" type="number" min="0" step="1" value={form.critico} onChange={set('critico')} />
        <label>Categoría</label>
        <select id="categoria" value={form.categoria} onChange={set('categoria')}>
          {CATEGORIAS.map((c) => <option key={c}>{c}</option>)}
        </select>
        <label>Ruta de imagen (opcional)</label>
        <input id="imagenUrl" placeholder="/images/herramienta.svg" value={form.imagenUrl} onChange={set('imagenUrl')} />
        <button disabled={enviando}>{enviando ? 'Guardando...' : 'Guardar'}</button>
        <p className={msg.ok ? 'msg ok' : 'msg'}>{msg.texto}</p>
      </form>
    </>
  )
}

export default FormularioProductoAdmin
