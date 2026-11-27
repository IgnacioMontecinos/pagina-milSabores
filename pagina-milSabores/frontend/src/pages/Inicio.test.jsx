import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Inicio from './Inicio'
import { TiendaProvider } from '../tienda'
import ferreteria from '../assets/ferreteria.jpg'

describe('Inicio', () => {
  it('usa ferreteria.jpg como fondo del hero principal', () => {
    const { container } = render(
      <TiendaProvider>
        <MemoryRouter>
          <Inicio />
        </MemoryRouter>
      </TiendaProvider>,
    )

    const hero = container.querySelector('.hero.hero-inicio')
    expect(hero).toBeInTheDocument()
    expect(hero.style.getPropertyValue('--hero-image')).toBe(`url(${ferreteria})`)
    expect(hero.querySelector('img')).toBeNull()
    expect(screen.getByRole('heading', { name: 'Ferretería Los Maestros' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Ver catálogo' })).toHaveAttribute('href', '/productos')
  })
})
