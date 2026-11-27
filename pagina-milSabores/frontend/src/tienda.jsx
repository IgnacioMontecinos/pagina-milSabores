import { useEffect, useMemo, useState } from 'react'
import { TiendaCtx } from './contexto'
import { api, mensajeError, mensajeErrorInicioSesion } from './services/api'
import { useAuth } from './contextoAuth'
import {
  PRODUCTOS_INICIALES,
  USUARIOS_INICIALES,
  esProductoDeFerreteria,
  guardar,
  leer,
} from './datos'

const normalizarProducto = (p) => ({
  ...p,
  imagenUrl: p.imagenUrl || p.img || '',
  critico: p.stockCritico ?? p.critico ?? 0,
})

const productosValidos = (lista) => (Array.isArray(lista) ? lista : [])
  .filter(esProductoDeFerreteria)
  .map(normalizarProducto)

const productosIniciales = () => {
  const guardados = leer('productos', PRODUCTOS_INICIALES)
  const validos = productosValidos(guardados)
  if (validos.length || (Array.isArray(guardados) && guardados.length === 0)) return validos
  return productosValidos(PRODUCTOS_INICIALES)
}

export function TiendaProvider({ children }) {
  const [productos, setProductos] = useState(productosIniciales)
  const [usuarios, setUsuarios] = useState(() => leer('usuarios', USUARIOS_INICIALES))
  const [carrito, setCarrito] = useState(() => leer('carrito', []))
  const [sesionLocal, setSesionLocal] = useState(() => leer('usuarioActual', null))
  const auth = useAuth()

  const sesion = auth?.usuario
    ? {
        id: auth.usuario.username === 'admin' ? 1 : 2,
        nombre: auth.usuario.nombre,
        username: auth.usuario.username,
        rol: auth.esAdmin ? 'Administrador' : 'Cliente',
        authorities: auth.usuario.authorities,
      }
    : sesionLocal

  useEffect(() => guardar('productos', productos), [productos])
  useEffect(() => guardar('usuarios', usuarios), [usuarios])
  useEffect(() => guardar('carrito', carrito), [carrito])
  useEffect(() => {
    if (sesionLocal) guardar('usuarioActual', sesionLocal)
    else localStorage.removeItem('usuarioActual')
  }, [sesionLocal])

  useEffect(() => {
    let activo = true
    api.listarProductos()
      .then((datos) => {
        const validos = productosValidos(datos)
        if (activo && validos.length) setProductos(validos)
      })
      .catch(() => {})
    return () => {
      activo = false
    }
  }, [])

  const cantidadCarrito = useMemo(
    () => carrito.reduce((a, x) => a + x.cantidad, 0),
    [carrito],
  )

  const agregarAlCarrito = (id) => {
    const p = productos.find((x) => x.id === id)
    const cantidadActual = carrito.find((x) => x.id === id)?.cantidad || 0
    if (!p || cantidadActual >= p.stock) {
      alert('No hay más stock disponible de este producto')
      return false
    }
    setCarrito((c) => {
      const x = c.find((y) => y.id === id)
      return x ? c.map((y) => (y.id === id ? { ...y, cantidad: y.cantidad + 1 } : y)) : [...c, { id, cantidad: 1 }]
    })
    alert('Producto agregado al carrito')
    return true
  }

  const quitarDelCarrito = (id) => setCarrito((c) => c.filter((x) => x.id !== id))

  const cambiarCantidad = (id, delta) => {
    const p = productos.find((x) => x.id === id)
    const linea = carrito.find((x) => x.id === id)
    if (!linea) return
    if (delta > 0 && p && linea.cantidad + delta > p.stock) {
      alert('No hay más stock disponible de este producto')
      return
    }
    setCarrito((c) =>
      c.map((x) => (x.id === id ? { ...x, cantidad: Math.max(1, x.cantidad + delta) } : x)),
    )
  }

  const finalizarCompra = () => {
    if (!carrito.length) return { ok: false, error: 'El carrito está vacío' }

    const descontados = carrito
      .map((x) => {
        const p = productos.find((y) => y.id === x.id)
        return p ? { id: p.id, cantidad: Math.min(x.cantidad, p.stock) } : null
      })
      .filter(Boolean)

    setProductos((ps) =>
      ps.map((p) => {
        const d = descontados.find((x) => x.id === p.id)
        return d ? { ...p, stock: Math.max(0, p.stock - d.cantidad) } : p
      }),
    )
    setCarrito([])
    return { ok: true }
  }

  const iniciarSesion = (identificador, password) => {
    if (auth) {
      return auth.login(identificador, password).then((u) => {
        const sesion = {
          id: u.username === 'admin' ? 1 : 2,
          nombre: u.nombre,
          username: u.username,
          rol: u.authorities.includes('ROLE_ADMIN') ? 'Administrador' : 'Cliente',
          authorities: u.authorities,
        }
        setSesionLocal(sesion)
        return { ok: true, usuario: sesion }
      }).catch((error) => ({ ok: false, error: mensajeErrorInicioSesion(error) }))
    }

    const u = USUARIOS_INICIALES.find(
      (x) =>
        (x.username === identificador ||
          x.correo.toLowerCase() === String(identificador).toLowerCase()) &&
        x.password === password,
    )
    if (!u) return { ok: false, error: 'Usuario o contraseña incorrectos.' }
    const sesion = {
      id: u.id,
      nombre: u.nombre,
      username: u.username,
      rol: u.authorities.includes('ROLE_ADMIN') ? 'Administrador' : 'Cliente',
      authorities: u.authorities,
    }
    setSesionLocal(sesion)
    return { ok: true, usuario: sesion }
  }

  const cerrarSesion = () => {
    if (auth) auth.logout()
    setSesionLocal(null)
  }

  const guardarProducto = async (datos, { esEdicion = false } = {}) => {
    const stockCritico = datos.critico === '' || datos.stockCritico === ''
      ? null
      : datos.critico ?? datos.stockCritico ?? null
    const cuerpo = {
      codigo: datos.codigo,
      nombre: datos.nombre,
      descripcion: datos.descripcion,
      precio: datos.precio,
      stock: datos.stock,
      stockCritico,
      categoria: datos.categoria,
      imagenUrl: datos.imagenUrl,
    }

    try {
      const guardado = esEdicion
        ? await api.actualizarProducto(datos.id, cuerpo)
        : await api.crearProducto(cuerpo)

      if (!guardado?.id) {
        return { ok: false, error: 'El servidor no devolvió el producto guardado.' }
      }

      const producto = normalizarProducto(guardado)
      setProductos((ps) => (
        esEdicion
          ? ps.map((p) => (p.id === datos.id ? producto : p))
          : [...ps, producto]
      ))
      return { ok: true, producto }
    } catch (error) {
      return { ok: false, error: mensajeError(error) }
    }
  }

  const eliminarProducto = async (id) => {
    try {
      await api.eliminarProducto(id)
      setProductos((ps) => ps.filter((x) => x.id !== id))
      return { ok: true }
    } catch (error) {
      return { ok: false, error: mensajeError(error) }
    }
  }

  const guardarUsuario = (u) => {
    setUsuarios((us) => {
      const pos = us.findIndex((x) => x.id === u.id)
      if (pos >= 0) {
        const copia = [...us]
        copia[pos] = u
        return copia
      }
      return [...us, u]
    })
  }

  const eliminarUsuario = (id) => setUsuarios((us) => us.filter((x) => x.id !== id))

  return (
    <TiendaCtx.Provider
      value={{
        productos,
        usuarios,
        carrito,
        sesion,
        cantidadCarrito,
        agregarAlCarrito,
        quitarDelCarrito,
        cambiarCantidad,
        finalizarCompra,
        iniciarSesion,
        cerrarSesion,
        guardarProducto,
        eliminarProducto,
        guardarUsuario,
        eliminarUsuario,
      }}
    >
      {children}
    </TiendaCtx.Provider>
  )
}
