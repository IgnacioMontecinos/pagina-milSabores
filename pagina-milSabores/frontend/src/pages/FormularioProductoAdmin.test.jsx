import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import FormularioProductoAdmin from './FormularioProductoAdmin'
import { TiendaProvider } from '../tienda'
import { useTienda } from '../useTienda'

const productoBase = {
  id: 1,
  codigo: 'HM-001',
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

function ListaProductosPrueba() {
  const { productos } = useTienda()
  return (
    <>
      <h1>Lista de productos</h1>
      <ul>
        {productos.map((p) => <li key={p.id}>{p.id}: {p.nombre}</li>)}
      </ul>
    </>
  )
}

function renderizarFormulario() {
  return render(
    <TiendaProvider>
      <MemoryRouter initialEntries={['/admin/producto-form']}>
        <Routes>
          <Route path="/admin/producto-form" element={<FormularioProductoAdmin />} />
          <Route path="/admin/productos" element={<ListaProductosPrueba />} />
        </Routes>
      </MemoryRouter>
    </TiendaProvider>,
  )
}

function mockFetch({ productos = [productoBase], crear } = {}) {
  const fn = vi.fn((url, opciones = {}) => {
    const metodo = (opciones.method || 'GET').toUpperCase()
    const ruta = String(url).replace('http://localhost:8080', '')
    if (metodo === 'GET' && ruta === '/api/productos') {
      return Promise.resolve(respuestaJson(productos))
    }
    if (metodo === 'POST' && ruta === '/api/productos') {
      return crear(url, opciones)
    }
    return Promise.reject(new Error(`Sin mock para ${metodo} ${ruta}`))
  })
  vi.stubGlobal('fetch', fn)
  return fn
}

async function llenarFormulario(container) {
  await userEvent.type(container.querySelector('#codigo'), 'HM-009')
  await userEvent.type(container.querySelector('#nombre'), 'Martillo Especial')
  await userEvent.type(container.querySelector('#descripcion'), 'Martillo de prueba para el inventario.')
  await userEvent.type(container.querySelector('#precio'), '15000')
  await userEvent.type(container.querySelector('#stock'), '4')
}

describe('FormularioProductoAdmin', () => {
  it('muestra un error si el código tiene menos de 3 caracteres', async () => {
    const { container } = renderizarFormulario()
    await userEvent.type(container.querySelector('#codigo'), 'AB')
    await userEvent.type(container.querySelector('#nombre'), 'Martillo Especial')
    await userEvent.type(container.querySelector('#precio'), '15000')
    await userEvent.type(container.querySelector('#stock'), '4')
    await userEvent.click(screen.getByRole('button', { name: 'Guardar' }))
    expect(screen.getByText('El código debe tener mínimo 3 caracteres')).toBeInTheDocument()
  })

  it('muestra un error si el stock no es un número entero', async () => {
    const { container } = renderizarFormulario()
    await userEvent.type(container.querySelector('#codigo'), 'HM-009')
    await userEvent.type(container.querySelector('#nombre'), 'Martillo Especial')
    await userEvent.type(container.querySelector('#precio'), '15000')
    await userEvent.type(container.querySelector('#stock'), '4.5')
    fireEvent.submit(container.querySelector('#productForm'))
    expect(screen.getByText('Stock inválido')).toBeInTheDocument()
  })

  it('crea una herramienta en el backend y usa el id devuelto', async () => {
    localStorage.setItem('jwt', 'token-de-prueba')
    const fetchMock = mockFetch({
      crear: (url, opciones) => {
        const cuerpo = JSON.parse(opciones.body)
        return Promise.resolve(respuestaJson({ ...productoBase, ...cuerpo, id: 9001 }, 201))
      },
    })
    const { container } = renderizarFormulario()
    await llenarFormulario(container)
    await userEvent.click(screen.getByRole('button', { name: 'Guardar' }))

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Lista de productos' })).toBeInTheDocument()
    })
    expect(screen.getByText('9001: Martillo Especial')).toBeInTheDocument()

    const llamada = fetchMock.mock.calls.find(([, opciones]) => opciones?.method === 'POST')
    expect(llamada).toBeTruthy()
    expect(String(llamada[0])).toBe('http://localhost:8080/api/productos')
    const cuerpoEnviado = JSON.parse(llamada[1].body)
    expect(cuerpoEnviado).not.toHaveProperty('id')
    expect(cuerpoEnviado).toMatchObject({ codigo: 'HM-009', nombre: 'Martillo Especial' })
  })

  it('muestra el error del backend y no agrega el producto si la creación falla', async () => {
    localStorage.setItem('jwt', 'token-de-prueba')
    mockFetch({
      crear: () => Promise.resolve(respuestaJson({ message: 'Ya existe un producto con el código HM-009' }, 409)),
    })
    const { container } = renderizarFormulario()
    await llenarFormulario(container)
    await userEvent.click(screen.getByRole('button', { name: 'Guardar' }))

    await waitFor(() => {
      expect(screen.getByText('Ya existe un producto con el código HM-009')).toBeInTheDocument()
    })
    expect(screen.getByRole('heading', { name: 'Nueva herramienta' })).toBeInTheDocument()
    const guardados = JSON.parse(localStorage.getItem('productos') || '[]')
    expect(guardados.some((p) => p.codigo === 'HM-009')).toBe(false)
  })
})
