import { describe, it, expect } from 'vitest'
import { money, emailOK, validarRun, leer, guardar } from './datos'

describe('money', () => {
  it('formatea un precio con simbolo y separador de miles', () => {
    expect(money(18990)).toBe('$' + (18990).toLocaleString('es-CL'))
  })

  it('muestra el cero como $0', () => {
    expect(money(0)).toBe('$0')
  })
})

describe('emailOK', () => {
  it('acepta correos @duoc.cl, @profesor.duoc.cl y @gmail.com', () => {
    expect(emailOK('admin@duoc.cl')).toBe(true)
    expect(emailOK('docente@profesor.duoc.cl')).toBe(true)
    expect(emailOK('cliente@gmail.com')).toBe(true)
  })

  it('rechaza dominios no permitidos', () => {
    expect(emailOK('alguien@hotmail.com')).toBe(false)
    expect(emailOK('sin-correo')).toBe(false)
  })
})

describe('validarRun', () => {
  it('acepta un RUN valido (con o sin puntos y guion)', () => {
    expect(validarRun('11111111-1')).toBe(true)
    expect(validarRun('11.111.111-1')).toBe(true)
  })

  it('rechaza un RUN con digito verificador incorrecto', () => {
    expect(validarRun('11111111-2')).toBe(false)
  })
})

describe('leer y guardar', () => {
  it('guarda y recupera un valor desde localStorage', () => {
    guardar('prueba', { a: 1 })
    expect(leer('prueba', null)).toEqual({ a: 1 })
  })

  it('devuelve el valor por defecto cuando la clave no existe', () => {
    expect(leer('no-existe', 'defecto')).toBe('defecto')
  })
})
