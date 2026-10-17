import { useEffect, useMemo, useState } from 'react'
import { TiendaCtx } from './contexto'
import {
  PRODUCTOS_INICIALES,
  USUARIOS_INICIALES,
  guardar,
  leer,
} from './datos'

export function TiendaProvider({ children }) {
  const [productos, setProductos] = useState(() => leer('productos', PRODUCTOS_INICIALES))
  const [usuarios, setUsuarios] = useState(() => leer('usuarios', USUARIOS_INICIALES))
  const [carrito, setCarrito] = useState(() => leer('carrito', []))
  const [sesion, setSesion] = useState(() => leer('usuarioActual', null))

  useEffect(() => guardar('productos', productos), [productos])
  useEffect(() => guardar('usuarios', usuarios), [usuarios])
  useEffect(() => guardar('carrito', carrito), [carrito])
  useEffect(() => {
    if (sesion) guardar('usuarioActual', sesion)
    else localStorage.removeItem('usuarioActual')
  }, [sesion])

  const cantidadCarrito = useMemo(
    () => carrito.reduce((a, x) => a + x.cantidad, 0),
    [carrito],
  )

  const agregarAlCarrito = (id) => {
    setCarrito((c) => {
      const x = c.find((y) => y.id === id)
      return x ? c.map((y) => (y.id === id ? { ...y, cantidad: y.cantidad + 1 } : y)) : [...c, { id, cantidad: 1 }]
    })
    alert('Producto agregado al carrito')
  }

  const quitarDelCarrito = (id) => setCarrito((c) => c.filter((x) => x.id !== id))

  const cambiarCantidad = (id, delta) =>
    setCarrito((c) =>
      c.map((x) => (x.id === id ? { ...x, cantidad: Math.max(1, x.cantidad + delta) } : x)),
    )

  const iniciarSesion = (correo, password) => {
    const u = usuarios.find(
      (x) => x.correo.toLowerCase() === correo.toLowerCase() && x.password === password,
    )
    if (!u) return { ok: false, error: 'Correo o contraseña incorrectos' }
    setSesion(u)
    return { ok: true, usuario: u }
  }

  const cerrarSesion = () => setSesion(null)

  const guardarProducto = (p) => {
    setProductos((ps) => {
      const pos = ps.findIndex((y) => y.id === p.id)
      if (pos >= 0) {
        const copia = [...ps]
        copia[pos] = p
        return copia
      }
      return [...ps, p]
    })
  }

  const eliminarProducto = (id) => setProductos((ps) => ps.filter((x) => x.id !== id))

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
