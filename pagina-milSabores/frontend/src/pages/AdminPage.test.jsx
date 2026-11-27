import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import AdminPage from './AdminPage'
import { TiendaProvider } from '../tienda'

const producto = {
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

function crearFetch(borrar) {
  const fn = vi.fn((url, opciones = {}) => {
    const metodo = (opciones.method || 'GET').toUpperCase()
    const ruta = String(url).replace('http://localhost:8080', '')
    if (metodo === 'GET' && ruta === '/api/productos') {
      return Promise.resolve(respuestaJson([producto]))
    }
    if (metodo === 'DELETE' && ruta === '/api/productos/2000001') {
      return Promise.resolve(borrar())
    }
    return Promise.reject(new Error(`Sin mock para ${metodo} ${ruta}`))
  })
  vi.stubGlobal('fetch', fn)
  return fn
}

function renderizarAdmin() {
  return render(
    <TiendaProvider>
      <MemoryRouter initialEntries={['/admin/productos']}>
        <AdminPage />
      </MemoryRouter>
    </TiendaProvider>,
  )
}

describe('AdminPage eliminación de productos', () => {
  it('muestra éxito y quita la fila cuando el backend confirma', async () => {
    const fetchMock = crearFetch(() => respuestaJson({}, 204))
    renderizarAdmin()
    await screen.findByText('Martillo base')

    await userEvent.click(screen.getByRole('button', { name: 'Eliminar' }))

    await waitFor(() => {
      expect(screen.getByText('Producto eliminado correctamente.')).toBeInTheDocument()
    })
    expect(screen.queryByText('Martillo base')).not.toBeInTheDocument()
    expect(fetchMock.mock.calls.some(([url, opciones]) => (
      opciones?.method === 'DELETE' && String(url).endsWith('/api/productos/2000001')
    ))).toBe(true)
  })

  it('mantiene la fila y muestra el error cuando la eliminación falla', async () => {
    crearFetch(() => respuestaJson({ message: 'No permitido' }, 403))
    renderizarAdmin()
    await screen.findByText('Martillo base')

    await userEvent.click(screen.getByRole('button', { name: 'Eliminar' }))

    await waitFor(() => {
      expect(screen.getByText('No tienes permisos para realizar esta acción.')).toBeInTheDocument()
    })
    expect(screen.getByText('Martillo base')).toBeInTheDocument()
  })
})
