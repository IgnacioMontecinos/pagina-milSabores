import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
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
    expect(screen.getByRole('heading', { name: 'Nuestros productos' })).toBeInTheDocument()
  })

  it('renderiza los productos del catalogo con su precio', () => {
    renderizarProductos()
    expect(screen.getByText('Torta de Chocolate')).toBeInTheDocument()
    expect(screen.getByText('Cheesecake')).toBeInTheDocument()
    expect(screen.getAllByRole('heading', { level: 3 }).length).toBeGreaterThanOrEqual(6)
  })

  it('permite agregar un producto al carrito', () => {
    renderizarProductos()
    const botones = screen.getAllByRole('button', { name: 'Añadir al carrito' })
    expect(botones.length).toBeGreaterThan(0)
  })
})
