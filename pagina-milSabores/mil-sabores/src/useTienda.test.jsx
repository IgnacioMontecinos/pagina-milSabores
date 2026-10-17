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
})
