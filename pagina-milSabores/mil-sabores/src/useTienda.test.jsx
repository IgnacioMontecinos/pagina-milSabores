import { describe, it, expect, beforeEach } from 'vitest'
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

  it('agrega un producto al carrito y aumenta la cantidad', () => {
    const { result } = usarTienda()
    act(() => result.current.agregarAlCarrito(1))
    act(() => result.current.agregarAlCarrito(1))
    expect(result.current.cantidadCarrito).toBe(2)
  })

  it('quita un producto del carrito', () => {
    const { result } = usarTienda()
    act(() => result.current.agregarAlCarrito(2))
    act(() => result.current.quitarDelCarrito(2))
    expect(result.current.cantidadCarrito).toBe(0)
  })

  it('inicia sesion con credenciales correctas', () => {
    const { result } = usarTienda()
    let respuesta
    act(() => {
      respuesta = result.current.iniciarSesion('admin@duoc.cl', '1234')
    })
    expect(respuesta.ok).toBe(true)
    expect(result.current.sesion.rol).toBe('Administrador')
  })

  it('rechaza credenciales incorrectas', () => {
    const { result } = usarTienda()
    let respuesta
    act(() => {
      respuesta = result.current.iniciarSesion('admin@duoc.cl', 'mala')
    })
    expect(respuesta.ok).toBe(false)
    expect(result.current.sesion).toBeNull()
  })

  it('guarda los productos en localStorage', () => {
    usarTienda()
    const guardados = JSON.parse(localStorage.getItem('productos'))
    expect(guardados.length).toBeGreaterThan(0)
  })

  it('no permite agregar más unidades que el stock disponible', () => {
    const { result } = usarTienda()
    // El producto 2 (Torta de Frutilla) tiene stock 8; se agregan 9 veces
    for (let i = 0; i < 9; i++) act(() => result.current.agregarAlCarrito(2))
    expect(result.current.cantidadCarrito).toBe(8)
    expect(result.current.carrito.find((x) => x.id === 2).cantidad).toBe(8)
  })

  it('aumentar la cantidad respeta el stock disponible', () => {
    const { result } = usarTienda()
    act(() => result.current.agregarAlCarrito(2))
    for (let i = 0; i < 10; i++) act(() => result.current.cambiarCantidad(2, 1))
    expect(result.current.carrito.find((x) => x.id === 2).cantidad).toBe(8)
  })

  it('al pagar descuenta el stock, limpia el carrito y guarda los cambios', () => {
    const { result } = usarTienda()
    act(() => result.current.agregarAlCarrito(1))
    act(() => result.current.agregarAlCarrito(1))
    let respuesta
    act(() => {
      respuesta = result.current.finalizarCompra()
    })
    expect(respuesta.ok).toBe(true)
    expect(result.current.cantidadCarrito).toBe(0)
    expect(result.current.productos.find((x) => x.id === 1).stock).toBe(10)
    expect(JSON.parse(localStorage.getItem('productos')).find((x) => x.id === 1).stock).toBe(10)
    expect(JSON.parse(localStorage.getItem('carrito'))).toEqual([])
  })
})
