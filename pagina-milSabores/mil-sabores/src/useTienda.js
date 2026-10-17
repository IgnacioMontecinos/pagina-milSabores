import { useContext } from 'react'
import { TiendaCtx } from './contexto'

export function useTienda() {
  return useContext(TiendaCtx)
}
