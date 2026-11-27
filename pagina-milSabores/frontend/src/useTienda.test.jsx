import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { TiendaProvider } from './tienda'
import { useTienda } from './useTienda'

const envoltorio = ({ children }) => <TiendaProvider>{children}</TiendaProvider>

const usarTienda = () => renderHook(() => useTienda(), { wrapper: envoltorio })

describe('TiendaProvider y useTienda', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('parte con el carrito vacio', () => {
    const { result } = usarTienda()
    expect(result.current.cantidadCarrito).toBe(0)
  })

  it('agrega una herramienta al carrito y aumenta la cantidad', () => {
    const { result } = usarTienda()
    act(() => result.current.agregarAlCarrito(1))
    act(() => result.current.agregarAlCarrito(1))
    expect(result.current.cantidadCarrito).toBe(2)
  })

  it('quita una herramienta del carrito', () => {
    const { result } = usarTienda()
    act(() => result.current.agregarAlCarrito(2))
    act(() => result.current.quitarDelCarrito(2))
    expect(result.current.cantidadCarrito).toBe(0)
  })

  it('inicia sesion con credenciales de administrador', () => {
    const { result } = usarTienda()
    let respuesta
    act(() => {
      respuesta = result.current.iniciarSesion('admin', 'Admin123!')
    })
    expect(respuesta.ok).toBe(true)
    expect(result.current.sesion.rol).toBe('Administrador')
    expect(result.current.sesion.authorities).toContain('ROLE_ADMIN')
  })

  it('inicia sesion con credenciales de usuario', () => {
    const { result } = usarTienda()
    let respuesta
    act(() => {
      respuesta = result.current.iniciarSesion('user', 'User123!')
    })
    expect(respuesta.ok).toBe(true)
    expect(result.current.sesion.authorities).toContain('ROLE_USER')
  })

  it('rechaza credenciales incorrectas', () => {
    const { result } = usarTienda()
    let respuesta
    act(() => {
      respuesta = result.current.iniciarSesion('admin', 'mala')
    })
    expect(respuesta.ok).toBe(false)
    expect(result.current.sesion).toBeNull()
  })

  it('muestra el mensaje de sesión cuando una petición protegida responde 401', async () => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({
      status: 401,
      ok: false,
      json: () => Promise.resolve({ message: 'Token ausente, inválido o expirado.', status: 401 }),
    })))

    const { result } = usarTienda()
    let respuesta
    await act(async () => {
      respuesta = await result.current.guardarProducto({
        codigo: 'TEST-401',
        nombre: 'Producto de prueba',
        descripcion: 'Prueba',
        precio: 1000,
        stock: 1,
        stockCritico: 0,
        categoria: 'Herramientas Manuales',
        imagenUrl: '',
      })
    })

    expect(respuesta.ok).toBe(false)
    expect(respuesta.error).toBe(
      'Tu sesión no es válida o ha expirado. Vuelve a iniciar sesión.',
    )
  })

  it('guarda los productos en localStorage', () => {
    usarTienda()
    const guardados = JSON.parse(localStorage.getItem('productos'))
    expect(guardados.length).toBeGreaterThan(0)
  })

  it('descarta productos de pastelería guardados por una versión anterior', () => {
    localStorage.setItem('productos', JSON.stringify([
      { id: 99, nombre: 'Torta de chocolate', descripcion: 'Pastel con crema', categoria: 'Tortas', imagenUrl: '/torta-chocolate.jpg' },
    ]))
    const { result } = usarTienda()
    expect(result.current.productos.some((p) => /torta|pastel|chocolate/i.test(p.nombre))).toBe(false)
    expect(result.current.productos.length).toBeGreaterThanOrEqual(12)
  })

  it('no permite agregar más unidades que el stock disponible', () => {
    const { result } = usarTienda()
    const taladro = result.current.productos.find((p) => p.id === 2)
    for (let i = 0; i < taladro.stock + 1; i++) act(() => result.current.agregarAlCarrito(2))
    expect(result.current.cantidadCarrito).toBe(taladro.stock)
    expect(result.current.carrito.find((x) => x.id === 2).cantidad).toBe(taladro.stock)
  })

  it('aumentar la cantidad respeta el stock disponible', () => {
    const { result } = usarTienda()
    const taladro = result.current.productos.find((p) => p.id === 2)
    act(() => result.current.agregarAlCarrito(2))
    for (let i = 0; i < 10; i++) act(() => result.current.cambiarCantidad(2, 1))
    expect(result.current.carrito.find((x) => x.id === 2).cantidad).toBe(taladro.stock)
  })

  it('al pagar descuenta el stock, limpia el carrito y guarda los cambios', () => {
    const { result } = usarTienda()
    const martillo = result.current.productos.find((p) => p.id === 1)
    act(() => result.current.agregarAlCarrito(1))
    act(() => result.current.agregarAlCarrito(1))
    let respuesta
    act(() => {
      respuesta = result.current.finalizarCompra()
    })
    expect(respuesta.ok).toBe(true)
    expect(result.current.cantidadCarrito).toBe(0)
    expect(result.current.productos.find((x) => x.id === 1).stock).toBe(martillo.stock - 2)
    expect(JSON.parse(localStorage.getItem('productos')).find((x) => x.id === 1).stock).toBe(martillo.stock - 2)
    expect(JSON.parse(localStorage.getItem('carrito'))).toEqual([])
  })
})
