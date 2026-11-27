import { describe, it, expect, vi } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { TiendaProvider } from './tienda'
import { useTienda } from './useTienda'

const productoBase = {
  id: 2000001,
  codigo: 'HM-100',
  nombre: 'Martillo base',
  descripcion: 'Producto inicial',
  precio: 10000,
  stock: 5,
  stockCritico: 2,
  categoria: 'Herramientas Manuales',
  imagenUrl: '/images/herramienta.svg',
}

const respuestaJson = (cuerpo, status = 200) => ({
  status,
  ok: status >= 200 && status < 300,
  json: async () => cuerpo,
})

function crearFetch(handlers) {
  const fn = vi.fn((url, opciones = {}) => {
    const metodo = (opciones.method || 'GET').toUpperCase()
    const ruta = String(url).replace('http://localhost:8080', '')
    const handler = handlers[`${metodo} ${ruta}`]
    if (!handler) return Promise.reject(new Error(`Sin mock para ${metodo} ${ruta}`))
    return Promise.resolve(handler(url, opciones))
  })
  vi.stubGlobal('fetch', fn)
  return fn
}

async function montar(handlers) {
  const fetchMock = crearFetch(handlers)
  const { result } = renderHook(() => useTienda(), { wrapper: TiendaProvider })
  await waitFor(() => {
    expect(result.current.productos.some((p) => p.id === productoBase.id)).toBe(true)
  })
  return { result, fetchMock }
}

const datosNuevos = {
  codigo: 'HM-500',
  nombre: 'Martillo nuevo',
  descripcion: 'Creado desde el panel',
  precio: 15000,
  stock: 4,
  critico: 2,
  categoria: 'Herramientas Manuales',
  imagenUrl: '/images/herramienta.svg',
}

describe('CRUD de productos contra la API', () => {
  it('crea con POST y agrega el producto usando el id generado por el backend', async () => {
    const { result, fetchMock } = await montar({
      'GET /api/productos': () => respuestaJson([productoBase]),
      'POST /api/productos': (url, opciones) => respuestaJson(
        { ...productoBase, ...JSON.parse(opciones.body), id: 9001 },
        201,
      ),
    })

    const cantidadInicial = result.current.productos.length
    let respuesta
    await act(async () => {
      respuesta = await result.current.guardarProducto(datosNuevos, { esEdicion: false })
    })

    expect(respuesta.ok).toBe(true)
    expect(result.current.productos).toHaveLength(cantidadInicial + 1)
    expect(result.current.productos.some((p) => p.id === 9001 && p.nombre === 'Martillo nuevo')).toBe(true)

    const llamada = fetchMock.mock.calls.find(([, opciones]) => opciones?.method === 'POST')
    expect(llamada).toBeTruthy()
    expect(String(llamada[0])).toBe('http://localhost:8080/api/productos')
    const cuerpo = JSON.parse(llamada[1].body)
    expect(cuerpo).not.toHaveProperty('id')
    expect(cuerpo).toMatchObject({ codigo: 'HM-500', nombre: 'Martillo nuevo', stockCritico: 2 })
  })

  it('no modifica la lista si la creación falla', async () => {
    const { result } = await montar({
      'GET /api/productos': () => respuestaJson([productoBase]),
      'POST /api/productos': () => respuestaJson({ message: 'El nombre del producto es obligatorio.' }, 400),
    })

    const cantidadInicial = result.current.productos.length
    let respuesta
    await act(async () => {
      respuesta = await result.current.guardarProducto(datosNuevos, { esEdicion: false })
    })

    expect(respuesta.ok).toBe(false)
    expect(respuesta.error).toBe('El nombre del producto es obligatorio.')
    expect(result.current.productos).toHaveLength(cantidadInicial)
    expect(result.current.productos.some((p) => p.codigo === 'HM-500')).toBe(false)
  })

  it('actualiza con PUT un id mayor a 1.000.000 sin usar POST', async () => {
    const { result, fetchMock } = await montar({
      'GET /api/productos': () => respuestaJson([productoBase]),
      'PUT /api/productos/2000001': (url, opciones) => respuestaJson(
        { ...productoBase, ...JSON.parse(opciones.body), id: 2000001 },
      ),
    })

    let respuesta
    await act(async () => {
      respuesta = await result.current.guardarProducto(
        { ...productoBase, nombre: 'Martillo actualizado' },
        { esEdicion: true },
      )
    })

    expect(respuesta.ok).toBe(true)
    expect(result.current.productos.find((p) => p.id === 2000001)?.nombre).toBe('Martillo actualizado')

    const llamadaPut = fetchMock.mock.calls.find(([url, opciones]) => (
      opciones?.method === 'PUT' && String(url).endsWith('/api/productos/2000001')
    ))
    expect(llamadaPut).toBeTruthy()
    expect(fetchMock.mock.calls.some(([, opciones]) => opciones?.method === 'POST')).toBe(false)
  })

  it('conserva el producto original si la actualización falla', async () => {
    const { result } = await montar({
      'GET /api/productos': () => respuestaJson([productoBase]),
      'PUT /api/productos/2000001': () => respuestaJson({ message: 'El precio debe ser mayor que cero.' }, 400),
    })

    let respuesta
    await act(async () => {
      respuesta = await result.current.guardarProducto(
        { ...productoBase, nombre: 'Nombre que no debe persistir' },
        { esEdicion: true },
      )
    })

    expect(respuesta.ok).toBe(false)
    expect(respuesta.error).toBe('El precio debe ser mayor que cero.')
    expect(result.current.productos.find((p) => p.id === 2000001)?.nombre).toBe('Martillo base')
  })

  it('elimina con DELETE y quita el producto solo si el backend confirma', async () => {
    const { result, fetchMock } = await montar({
      'GET /api/productos': () => respuestaJson([productoBase]),
      'DELETE /api/productos/2000001': () => respuestaJson({}, 204),
    })

    let respuesta
    await act(async () => {
      respuesta = await result.current.eliminarProducto(2000001)
    })

    expect(respuesta.ok).toBe(true)
    expect(result.current.productos.some((p) => p.id === 2000001)).toBe(false)
    expect(fetchMock.mock.calls.some(([url, opciones]) => (
      opciones?.method === 'DELETE' && String(url).endsWith('/api/productos/2000001')
    ))).toBe(true)
  })

  it('conserva el producto si la eliminación falla', async () => {
    const { result } = await montar({
      'GET /api/productos': () => respuestaJson([productoBase]),
      'DELETE /api/productos/2000001': () => respuestaJson({ message: 'No permitido' }, 403),
    })

    let respuesta
    await act(async () => {
      respuesta = await result.current.eliminarProducto(2000001)
    })

    expect(respuesta.ok).toBe(false)
    expect(respuesta.error).toBe('No tienes permisos para realizar esta acción.')
    expect(result.current.productos.some((p) => p.id === 2000001)).toBe(true)
  })

  it('informa un error de red y no modifica la lista', async () => {
    const { result } = await montar({
      'GET /api/productos': () => respuestaJson([productoBase]),
      'POST /api/productos': () => Promise.reject(new TypeError('fallo de red')),
    })

    const cantidadInicial = result.current.productos.length
    let respuesta
    await act(async () => {
      respuesta = await result.current.guardarProducto(datosNuevos, { esEdicion: false })
    })

    expect(respuesta.ok).toBe(false)
    expect(respuesta.error).toBe('No fue posible conectar con el servidor.')
    expect(result.current.productos).toHaveLength(cantidadInicial)
  })
})
