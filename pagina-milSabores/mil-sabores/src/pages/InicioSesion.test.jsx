import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import InicioSesion from './InicioSesion'
import { TiendaProvider } from '../tienda'

function renderizarLogin() {
  return render(
    <TiendaProvider>
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route path="/login" element={<InicioSesion />} />
          <Route path="/admin" element={<h1>Panel de administracion</h1>} />
          <Route path="/" element={<h1>Inicio</h1>} />
        </Routes>
      </MemoryRouter>
    </TiendaProvider>,
  )
}

describe('InicioSesion', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('muestra un error si el correo no es valido', async () => {
    const { container } = renderizarLogin()
    await userEvent.type(container.querySelector('#correo'), 'alguien@hotmail.com')
    await userEvent.type(container.querySelector('#password'), '1234')
    await userEvent.click(screen.getByRole('button', { name: 'Ingresar' }))
    expect(
      screen.getByText('Ingrese un correo @duoc.cl, @profesor.duoc.cl o @gmail.com'),
    ).toBeInTheDocument()
  })

  it('muestra un error si la contrasena es muy corta', async () => {
    const { container } = renderizarLogin()
    await userEvent.type(container.querySelector('#correo'), 'admin@duoc.cl')
    await userEvent.type(container.querySelector('#password'), '12')
    await userEvent.click(screen.getByRole('button', { name: 'Ingresar' }))
    expect(screen.getByText(/4 y 10 caracteres/i)).toBeInTheDocument()
  })

  it('inicia sesion y navega al panel de administracion', async () => {
    const { container } = renderizarLogin()
    await userEvent.type(container.querySelector('#correo'), 'admin@duoc.cl')
    await userEvent.type(container.querySelector('#password'), '1234')
    await userEvent.click(screen.getByRole('button', { name: 'Ingresar' }))
    expect(screen.getByText('Panel de administracion')).toBeInTheDocument()
  })

  it('muestra un error con credenciales incorrectas', async () => {
    const { container } = renderizarLogin()
    await userEvent.type(container.querySelector('#correo'), 'admin@duoc.cl')
    await userEvent.type(container.querySelector('#password'), '9999')
    await userEvent.click(screen.getByRole('button', { name: 'Ingresar' }))
    expect(screen.getByText(/incorrectos/i)).toBeInTheDocument()
  })
})
