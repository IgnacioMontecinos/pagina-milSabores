import { describe, it, expect, vi } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { AuthProvider } from './AuthContext'
import { useAuth } from './contextoAuth'

const respuesta = (cuerpo, status = 200) =>
  Promise.resolve({
    status,
    ok: status >= 200 && status < 300,
    json: () => Promise.resolve(cuerpo),
  })

const envoltorio = ({ children }) => <AuthProvider>{children}</AuthProvider>

function mockApi() {
  vi.stubGlobal('fetch', vi.fn((url) => {
    if (String(url).endsWith('/auth/login')) {
      return respuesta({ token: 'token-de-prueba', username: 'admin', authorities: ['ROLE_ADMIN'] })
    }
    if (String(url).endsWith('/auth/me')) {
      return respuesta({ username: 'admin', nombre: 'Administrador', authorities: ['ROLE_ADMIN'] })
    }
    return respuesta([])
  }))
}

describe('AuthContext', () => {
  it('guarda el JWT y deriva ROLE_ADMIN al iniciar sesión', async () => {
    mockApi()
    const { result } = renderHook(() => useAuth(), { wrapper: envoltorio })

    await act(async () => {
      await result.current.login('admin', 'Admin123!')
    })

    expect(localStorage.getItem('jwt')).toBe('token-de-prueba')
    expect(result.current.usuario.username).toBe('admin')
    expect(result.current.esAdmin).toBe(true)

    act(() => result.current.logout())
    expect(localStorage.getItem('jwt')).toBeNull()
    expect(result.current.autenticado).toBe(false)
  })

  it('restaura la sesión con GET /auth/me al refrescar', async () => {
    mockApi()
    localStorage.setItem('jwt', 'token-de-prueba')
    const { result } = renderHook(() => useAuth(), { wrapper: envoltorio })

    await waitFor(() => expect(result.current.usuario).not.toBeNull())
    expect(result.current.usuario.authorities).toContain('ROLE_ADMIN')
    expect(globalThis.fetch).toHaveBeenCalledWith(
      'http://localhost:8080/auth/me',
      expect.objectContaining({ headers: expect.any(Headers) }),
    )
  })

  it('cierra la sesión y borra el JWT cuando GET /auth/me responde 401', async () => {
    vi.stubGlobal('fetch', vi.fn((url) => {
      if (String(url).endsWith('/auth/me')) {
        return respuesta({ message: 'Token ausente, inválido o expirado.', status: 401 }, 401)
      }
      return respuesta([])
    }))

    localStorage.setItem('jwt', 'token-expirado-de-prueba')
    const { result } = renderHook(() => useAuth(), { wrapper: envoltorio })

    await waitFor(() => expect(result.current.cargando).toBe(false))
    await waitFor(() => expect(localStorage.getItem('jwt')).toBeNull())
    expect(sessionStorage.getItem('jwt')).toBeNull()
    expect(result.current.token).toBeNull()
    expect(result.current.usuario).toBeNull()
    expect(result.current.autenticado).toBe(false)
  })
})
