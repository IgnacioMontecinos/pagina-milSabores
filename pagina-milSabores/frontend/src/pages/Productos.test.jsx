import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import Productos from './Productos'
import { TiendaProvider } from '../tienda'

function renderizarProductos() {
  return render(
    <TiendaProvider>
      <MemoryRouter>
        <Productos />
      </MemoryRouter>
    </TiendaProvider>,
  )
}

describe('Productos', () => {
  it('muestra el titulo de la seccion', () => {
    renderizarProductos()
    expect(screen.getByRole('heading', { name: 'Catálogo de herramientas' })).toBeInTheDocument()
  })

  it('renderiza herramientas del catalogo con su precio', () => {
    renderizarProductos()
    expect(screen.getByText('Martillo de acero 20 oz')).toBeInTheDocument()
    expect(screen.getByText('Taladro percutor 800 W')).toBeInTheDocument()
    expect(screen.getAllByRole('heading', { level: 3 }).length).toBeGreaterThanOrEqual(12)
  })

  it('permite agregar una herramienta al carrito', () => {
    renderizarProductos()
    const botones = screen.getAllByRole('button', { name: 'Añadir al carrito' })
    expect(botones.length).toBeGreaterThan(0)
  })

  it('filtra por texto y por categoria', async () => {
    const { container } = renderizarProductos()
    await userEvent.type(container.querySelector('#busqueda'), 'taladro')
    expect(screen.getByText('Taladro percutor 800 W')).toBeInTheDocument()
    expect(screen.queryByText('Martillo de acero 20 oz')).not.toBeInTheDocument()

    await userEvent.clear(container.querySelector('#busqueda'))
    await userEvent.selectOptions(container.querySelector('#categoria'), 'Pinturas y Acabados')
    expect(screen.getByText('Esmalte sintético 1 L')).toBeInTheDocument()
    expect(screen.queryByText('Taladro percutor 800 W')).not.toBeInTheDocument()
  })
})
