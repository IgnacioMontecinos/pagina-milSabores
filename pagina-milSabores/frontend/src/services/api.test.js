import { describe, it, expect, vi, beforeEach } from 'vitest'
import { api, mensajeError, mensajeErrorInicioSesion } from './api'

const errorConEstado = (status, message = 'Error del servidor') => {
  const error = new Error(message)
  error.status = status
  return error
}

describe('mensajeError', () => {
  it('traduce el 401 a un mensaje de sesión', () => {
    expect(mensajeError(errorConEstado(401))).toBe(
      'Tu sesión no es válida o ha expirado. Vuelve a iniciar sesión.',
    )
  })

  it('traduce el 403 a un mensaje de permisos', () => {
    expect(mensajeError(errorConEstado(403))).toBe(
      'No tienes permisos para realizar esta acción.',
    )
  })

  it('traduce el 404 a un mensaje de producto inexistente', () => {
    expect(mensajeError(errorConEstado(404))).toBe(
      'El producto no existe o ya fue eliminado.',
    )
  })

  it('conserva el mensaje del backend en 400', () => {
    expect(mensajeError(errorConEstado(400, 'El stock no puede ser negativo.'))).toBe(
      'El stock no puede ser negativo.',
    )
  })

  it('conserva el mensaje del backend en 409', () => {
    expect(mensajeError(errorConEstado(409, 'Ya existe un producto con el código HM-001'))).toBe(
      'Ya existe un producto con el código HM-001',
    )
  })

  it('usa mensajes genéricos si el backend no entrega detalle', () => {
    expect(mensajeError(errorConEstado(400, 'Error 400'))).toBe(
      'Los datos del producto no son válidos.',
    )
    expect(mensajeError(errorConEstado(409, 'Error 409'))).toBe(
      'Ya existe un producto con ese código.',
    )
  })

  it('informa fallos de red cuando no hay estado HTTP', () => {
    expect(mensajeError(new TypeError('Failed to fetch'))).toBe(
      'No fue posible conectar con el servidor.',
    )
  })
})

describe('mensajeErrorInicioSesion', () => {
  it('traduce el 401 de login a credenciales incorrectas', () => {
    expect(mensajeErrorInicioSesion(errorConEstado(401))).toBe(
      'Usuario o contraseña incorrectos.',
    )
  })

  it('no muestra el mensaje de sesión expirada en el login', () => {
    expect(mensajeErrorInicioSesion(errorConEstado(401))).not.toMatch(/sesión/i)
  })

  it('conserva el mensaje del backend en otros errores de login', () => {
    expect(mensajeErrorInicioSesion(errorConEstado(400, 'La contraseña es obligatoria'))).toBe(
      'La contraseña es obligatoria',
    )
  })

  it('informa fallos de red cuando no hay estado HTTP', () => {
    expect(mensajeErrorInicioSesion(new TypeError('Failed to fetch'))).toBe(
      'No fue posible conectar con el servidor.',
    )
  })
})

describe('distinción entre login y peticiones autenticadas', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
  })

  const respuesta = (status, cuerpo) =>
    Promise.resolve({
      status,
      ok: status >= 200 && status < 300,
      json: () => Promise.resolve(cuerpo),
    })

  it('no envía el token almacenado en POST /auth/login', async () => {
    localStorage.setItem('jwt', 'token-viejo')
    const fetchMock = vi.fn(() =>
      respuesta(401, { message: 'Token ausente, inválido o expirado.' }),
    )
    vi.stubGlobal('fetch', fetchMock)

    const error = await api.login('admin', 'clave-erronea').catch((e) => e)

    expect(error.status).toBe(401)
    expect(error.esLogin).toBe(true)
    expect(mensajeErrorInicioSesion(error)).toBe('Usuario o contraseña incorrectos.')
    expect(mensajeError(error)).toBe(
      'Tu sesión no es válida o ha expirado. Vuelve a iniciar sesión.',
    )

    const [url, opciones] = fetchMock.mock.calls[0]
    expect(url).toBe('http://localhost:8080/auth/login')
    expect(opciones.headers.has('Authorization')).toBe(false)
  })

  it('sí envía el token en peticiones autenticadas y conserva el mensaje de sesión', async () => {
    localStorage.setItem('jwt', 'token-valido')
    const fetchMock = vi.fn(() =>
      respuesta(401, { message: 'Token ausente, inválido o expirado.' }),
    )
    vi.stubGlobal('fetch', fetchMock)

    const error = await api.me().catch((e) => e)

    expect(error.esLogin).toBe(false)
    expect(mensajeError(error)).toBe(
      'Tu sesión no es válida o ha expirado. Vuelve a iniciar sesión.',
    )

    const [, opciones] = fetchMock.mock.calls[0]
    expect(opciones.headers.get('Authorization')).toBe('Bearer token-valido')
  })
})
