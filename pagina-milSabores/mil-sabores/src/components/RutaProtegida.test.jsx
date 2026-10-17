import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import RutaProtegida from './RutaProtegida'
import { TiendaProvider } from '../tienda'

function renderizarRutaAdmin() {
  return render(
    <TiendaProvider>
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route path="/login" element={<h1>Inicio de sesion</h1>} />
          <Route
            path="/admin"
            element={
              <RutaProtegida>
                <h1>Panel de administracion</h1>
              </RutaProtegida>
            }
          />
        </Routes>
      </MemoryRouter>
    </TiendaProvider>,
  )
}

describe('RutaProtegida', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('redirige al login cuando no hay sesion', () => {
    renderizarRutaAdmin()
    expect(screen.getByRole('heading', { name: 'Inicio de sesion' })).toBeInTheDocument()
    expect(screen.queryByText('Panel de administracion')).not.toBeInTheDocument()
  })

  it('permite el acceso cuando hay sesion de administrador', () => {
    localStorage.setItem(
      'usuarioActual',
      JSON.stringify({ id: 1, nombre: 'Administrador', rol: 'Administrador' }),
    )
    renderizarRutaAdmin()
    expect(screen.getByText('Panel de administracion')).toBeInTheDocument()
  })

  it('redirige al login cuando la sesion es de rol Cliente', () => {
    localStorage.setItem(
      'usuarioActual',
      JSON.stringify({ id: 9, nombre: 'Cliente', rol: 'Cliente' }),
    )
    renderizarRutaAdmin()
    expect(screen.getByRole('heading', { name: 'Inicio de sesion' })).toBeInTheDocument()
  })
})
