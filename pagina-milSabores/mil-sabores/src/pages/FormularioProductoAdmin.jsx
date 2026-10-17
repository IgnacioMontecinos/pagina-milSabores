import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useTienda } from '../useTienda'

function FormularioProductoAdmin() {
  const { productos, guardarProducto } = useTienda()
  const [params] = useSearchParams()
  const navigate = useNavigate()

  const id = Number(params.get('id'))
  const p = productos.find((x) => x.id === id)

  const [form, setForm] = useState({
    codigo: p?.codigo || '',
    nombre: p?.nombre || '',
    descripcion: p?.descripcion || '',
    precio: p?.precio ?? '',
    stock: p?.stock ?? '',
    critico: p?.critico ?? '',
    categoria: p?.categoria || 'Tortas',
    img: p?.img || '',
  })
  const [msg, setMsg] = useState({ texto: '', ok: false })

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const onSubmit = (e) => {
    e.preventDefault()

    const x = {
      id: p?.id || Date.now(),
      codigo: form.codigo.trim(),
      nombre: form.nombre.trim(),
      descripcion: form.descripcion.trim(),
      precio: Number(form.precio),
      stock: Number(form.stock),
      critico: form.critico === '' ? '' : Number(form.critico),
      categoria: form.categoria,
      img: form.img.trim() ? (form.img.trim().startsWith('/') ? form.img.trim() : '/' + form.img.trim()) : '/cupcakes.jpg',
    }

    if (x.codigo.length < 3) return setMsg({ texto: 'El código debe tener mínimo 3 caracteres', ok: false })
    if (!x.nombre) return setMsg({ texto: 'El nombre es obligatorio', ok: false })
    if (!(x.precio >= 0)) return setMsg({ texto: 'Precio inválido', ok: false })
    if (!Number.isInteger(x.stock) || x.stock < 0) return setMsg({ texto: 'Stock inválido', ok: false })
    if (x.critico !== '' && (!Number.isInteger(x.critico) || x.critico < 0)) {
      return setMsg({ texto: 'Stock crítico inválido', ok: false })
    }

    guardarProducto(x)
    navigate('/admin/productos')
  }

  return (
    <>
      <h1>{p ? 'Editar' : 'Nuevo'} producto</h1>
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
          <option>Tortas</option>
          <option>Pasteles</option>
          <option>Dulces</option>
        </select>
        <label>Ruta imagen (opcional)</label>
        <input id="imagen" placeholder="/producto.jpg" value={form.img} onChange={set('img')} />
        <button>Guardar</button>
        <p className={msg.ok ? 'msg ok' : 'msg'}>{msg.texto}</p>
      </form>
    </>
  )
}

export default FormularioProductoAdmin
