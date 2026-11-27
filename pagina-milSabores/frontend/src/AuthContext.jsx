import { useCallback, useEffect, useMemo, useState } from 'react'
import { AuthContext } from './contextoAuth'
import { api, tokenApi } from './services/api'

function normalizar(usuario) {
  if (!usuario) return null
  const authorities = usuario.authorities || usuario.roles || []
  return {
    username: usuario.username || usuario.nombre,
    nombre: usuario.nombre || usuario.username,
    authorities: Array.isArray(authorities) ? authorities : [authorities],
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => tokenApi.leer())
  const [usuario, setUsuario] = useState(null)
  const [cargando, setCargando] = useState(Boolean(tokenApi.leer()))

  useEffect(() => {
    if (!token) return undefined

    let activo = true
    api.me()
      .then((respuesta) => {
        if (activo) setUsuario(normalizar(respuesta))
      })
      .catch(() => {
        if (!activo) return
        tokenApi.borrar()
        setToken(null)
        setUsuario(null)
      })
      .finally(() => {
        if (activo) setCargando(false)
      })

    return () => {
      activo = false
    }
  }, [token])

  const login = useCallback(async (username, password, recordar = true) => {
    const respuesta = await api.login(username, password)
    const nuevoToken = respuesta.token || respuesta.accessToken
    if (!nuevoToken) throw new Error('El servidor no devolvió un token válido.')

    setCargando(true)
    tokenApi.guardar(nuevoToken, recordar)
    setToken(nuevoToken)
    const nuevoUsuario = normalizar(respuesta)
    setUsuario(nuevoUsuario)
    return nuevoUsuario
  }, [])

  const logout = useCallback(() => {
    tokenApi.borrar()
    setToken(null)
    setUsuario(null)
    setCargando(false)
  }, [])

  const esAdmin = useMemo(
    () => Boolean(usuario?.authorities?.includes('ROLE_ADMIN')),
    [usuario],
  )

  const valor = useMemo(
    () => ({ token, usuario, cargando, login, logout, esAdmin, autenticado: Boolean(usuario) }),
    [token, usuario, cargando, login, logout, esAdmin],
  )

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>
}
