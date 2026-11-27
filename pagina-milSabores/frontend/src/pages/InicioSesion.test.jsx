import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import InicioSesion from './InicioSesion'
import { TiendaProvider } from '../tienda'
import { AuthProvider } from '../AuthContext'

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

function renderizarLoginConApi() {
  return render(
    <AuthProvider>
      <TiendaProvider>
        <MemoryRouter initialEntries={['/login']}>
          <Routes>
            <Route path="/login" element={<InicioSesion />} />
            <Route path="/admin" element={<h1>Panel de administracion</h1>} />
            <Route path="/" element={<h1>Inicio</h1>} />
          </Routes>
        </MemoryRouter>
      </TiendaProvider>
    </AuthProvider>,
  )
}

const respuesta = (status, cuerpo) =>
  Promise.resolve({
    status,
    ok: status >= 200 && status < 300,
    json: () => Promise.resolve(cuerpo),
  })

describe('InicioSesion', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('muestra credenciales de prueba', () => {
    renderizarLogin()
    expect(screen.getByText(/User123!/)).toBeInTheDocument()
    expect(screen.getByText(/Admin123!/)).toBeInTheDocument()
  })

  it('muestra un error si el usuario esta vacio', async () => {
    const { container } = renderizarLogin()
    await userEvent.type(container.querySelector('#password'), 'Admin123!')
    await userEvent.click(screen.getByRole('button', { name: 'Ingresar' }))
    expect(screen.getByText('El usuario es obligatorio')).toBeInTheDocument()
  })

  it('muestra un error si la contrasena es muy corta', async () => {
    const { container } = renderizarLogin()
    await userEvent.type(container.querySelector('#username'), 'admin')
    await userEvent.type(container.querySelector('#password'), '12')
    await userEvent.click(screen.getByRole('button', { name: 'Ingresar' }))
    expect(screen.getByText(/al menos 6 caracteres/i)).toBeInTheDocument()
  })

  it('inicia sesion y navega al panel de administracion', async () => {
    const { container } = renderizarLogin()
    await userEvent.type(container.querySelector('#username'), 'admin')
    await userEvent.type(container.querySelector('#password'), 'Admin123!')
    await userEvent.click(screen.getByRole('button', { name: 'Ingresar' }))
    await waitFor(() => expect(screen.getByText('Panel de administracion')).toBeInTheDocument())
  })

  it('inicia sesion como usuario y vuelve al inicio', async () => {
    const { container } = renderizarLogin()
    await userEvent.type(container.querySelector('#username'), 'user')
    await userEvent.type(container.querySelector('#password'), 'User123!')
    await userEvent.click(screen.getByRole('button', { name: 'Ingresar' }))
    await waitFor(() => expect(screen.getByText('Inicio')).toBeInTheDocument())
  })

  it('muestra un error con credenciales incorrectas', async () => {
    const { container } = renderizarLogin()
    await userEvent.type(container.querySelector('#username'), 'admin')
    await userEvent.type(container.querySelector('#password'), '999999')
    await userEvent.click(screen.getByRole('button', { name: 'Ingresar' }))
    await waitFor(() => expect(screen.getByText(/incorrectos/i)).toBeInTheDocument())
  })

  it('muestra credenciales incorrectas cuando el backend responde 401 en el login', async () => {
    vi.stubGlobal('fetch', vi.fn((url) => {
      if (String(url).endsWith('/auth/login')) {
        return respuesta(401, { message: 'Token ausente, inválido o expirado.', status: 401 })
      }
      return respuesta(200, [])
    }))

    const { container } = renderizarLoginConApi()
    await userEvent.type(container.querySelector('#username'), 'admin')
    await userEvent.type(container.querySelector('#password'), 'clave-erronea')
    await userEvent.click(screen.getByRole('button', { name: 'Ingresar' }))

    await waitFor(() =>
      expect(screen.getByText('Usuario o contraseña incorrectos.')).toBeInTheDocument(),
    )
    expect(screen.queryByText(/sesión no es válida o ha expirado/i)).not.toBeInTheDocument()
  })
})
