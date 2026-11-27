const BASE_URL = (import.meta.env?.VITE_API_URL || 'http://localhost:8080').replace(/\/$/, '')

const leerToken = () => localStorage.getItem('jwt') || sessionStorage.getItem('jwt')

const guardarToken = (token, recordar = true) => {
  if (recordar) {
    localStorage.setItem('jwt', token)
    sessionStorage.removeItem('jwt')
  } else {
    sessionStorage.setItem('jwt', token)
    localStorage.removeItem('jwt')
  }
}

const borrarToken = () => {
  localStorage.removeItem('jwt')
  sessionStorage.removeItem('jwt')
}

async function peticion(ruta, { metodo = 'GET', cuerpo, autenticado = true, esLogin = false, ...resto } = {}) {
  const cabeceras = new Headers(resto.headers || {})
  if (cuerpo !== undefined) cabeceras.set('Content-Type', 'application/json')

  const token = autenticado ? leerToken() : null
  if (token) cabeceras.set('Authorization', `Bearer ${token}`)

  let respuesta
  try {
    respuesta = await fetch(`${BASE_URL}${ruta}`, { ...resto, method: metodo, headers: cabeceras, body: cuerpo })
  } catch {
    throw new Error('No fue posible conectar con el servidor.')
  }

  if (respuesta.status === 204) return null

  const datos = await respuesta.json().catch(() => null)
  if (!respuesta.ok) {
    const error = new Error(datos?.message || datos?.error || `Error ${respuesta.status}`)
    error.status = respuesta.status
    error.esLogin = esLogin
    throw error
  }
  return datos
}

export function mensajeError(error) {
  const status = error?.status
  if (!status) return 'No fue posible conectar con el servidor.'
  if (status === 401) return 'Tu sesión no es válida o ha expirado. Vuelve a iniciar sesión.'
  if (status === 403) return 'No tienes permisos para realizar esta acción.'
  if (status === 404) return 'El producto no existe o ya fue eliminado.'
  if (status === 409) {
    return error.message && !error.message.startsWith('Error ')
      ? error.message
      : 'Ya existe un producto con ese código.'
  }
  if (status === 400) {
    return error.message && !error.message.startsWith('Error ')
      ? error.message
      : 'Los datos del producto no son válidos.'
  }
  return 'Ocurrió un error inesperado al comunicarse con el servidor.'
}

export function mensajeErrorInicioSesion(error) {
  const status = error?.status
  if (!status) return 'No fue posible conectar con el servidor.'
  if (status === 401) return 'Usuario o contraseña incorrectos.'
  return error.message && !error.message.startsWith('Error ')
    ? error.message
    : 'Ocurrió un error inesperado al comunicarse con el servidor.'
}

export const api = {
  login: (username, password) =>
    peticion('/auth/login', {
      metodo: 'POST',
      cuerpo: JSON.stringify({ username, password }),
      autenticado: false,
      esLogin: true,
    }),
  me: () => peticion('/auth/me'),
  listarProductos: () => peticion('/api/productos'),
  obtenerProducto: (id) => peticion(`/api/productos/${id}`),
  crearProducto: (producto) =>
    peticion('/api/productos', { metodo: 'POST', cuerpo: JSON.stringify(producto) }),
  actualizarProducto: (id, producto) =>
    peticion(`/api/productos/${id}`, { metodo: 'PUT', cuerpo: JSON.stringify(producto) }),
  eliminarProducto: (id) =>
    peticion(`/api/productos/${id}`, { metodo: 'DELETE' }),
}

export const tokenApi = { leer: leerToken, guardar: guardarToken, borrar: borrarToken }
