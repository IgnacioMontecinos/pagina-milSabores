import { existsSync } from 'node:fs'
import path from 'node:path'
import { describe, it, expect } from 'vitest'
import { CATEGORIAS, PRODUCTOS_INICIALES, money, emailOK, validarRun, leer, guardar } from './datos'

const publicDir = path.join(process.cwd(), 'public')

describe('catálogo de ferretería', () => {
  it('define las cuatro categorías principales', () => {
    expect(CATEGORIAS).toEqual([
      'Herramientas Manuales',
      'Herramientas Eléctricas',
      'Materiales y Construcción',
      'Pinturas y Acabados',
    ])
  })

  it('cada producto tiene los campos obligatorios', () => {
    expect(PRODUCTOS_INICIALES.length).toBeGreaterThanOrEqual(12)
    for (const p of PRODUCTOS_INICIALES) {
      expect(p).toHaveProperty('id')
      expect(p).toHaveProperty('nombre')
      expect(p).toHaveProperty('descripcion')
      expect(p).toHaveProperty('precio')
      expect(p).toHaveProperty('stock')
      expect(p).toHaveProperty('categoria')
      expect(p).toHaveProperty('imagenUrl')
      expect(CATEGORIAS).toContain(p.categoria)
    }
  })

  it('no incluye productos de pastelería', () => {
    const catalogo = JSON.stringify(PRODUCTOS_INICIALES).toLowerCase()
    expect(catalogo).not.toMatch(/pastel|torta|cupcake|cheesecake|alfajor|frutilla|lim[oó]n|chocolate|dulce|merengue|galleta|manjar|crema/)
  })

  it('todas las imágenes de producto existen en public', () => {
    for (const p of PRODUCTOS_INICIALES) {
      expect(p.imagenUrl.startsWith('/images/')).toBe(true)
      expect(existsSync(path.join(publicDir, p.imagenUrl.replace(/^\//, '')))).toBe(true)
    }
  })
})

describe('money', () => {
  it('formatea un precio con simbolo y separador de miles', () => {
    expect(money(12990)).toBe('$' + (12990).toLocaleString('es-CL'))
  })

  it('muestra el cero como $0', () => {
    expect(money(0)).toBe('$0')
  })
})

describe('emailOK', () => {
  it('acepta correos válidos', () => {
    expect(emailOK('admin@ferreterialosmaestros.cl')).toBe(true)
    expect(emailOK('cliente@gmail.com')).toBe(true)
  })

  it('acepta dominios libres y rechaza textos sin dominio', () => {
    expect(emailOK('alguien@hotmail.com')).toBe(true)
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
