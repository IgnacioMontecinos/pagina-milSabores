import { describe, it, expect } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import ImagenProducto from './ImagenProducto'
import { IMAGEN_FALLBACK, IMAGENES_PRODUCTO, imagenProducto } from '../imagenesProducto'
import { PRODUCTOS_INICIALES } from '../datos'

describe('ImagenProducto', () => {
  it('asigna una imagen existente a cada producto con coincidencia directa', () => {
    for (const producto of PRODUCTOS_INICIALES) {
      const esperada = IMAGENES_PRODUCTO[producto.codigo] || IMAGEN_FALLBACK
      expect(imagenProducto(producto)).toBe(esperada)
    }
  })

  it('renderiza la imagen asignada al producto', () => {
    const producto = PRODUCTOS_INICIALES.find((p) => p.codigo === 'HM-001')
    render(<ImagenProducto producto={producto} />)
    expect(screen.getByRole('img', { name: producto.nombre })).toHaveAttribute('src', IMAGENES_PRODUCTO['HM-001'])
  })

  it('usa la imagen de respaldo cuando no hay una imagen asignada', () => {
    const producto = PRODUCTOS_INICIALES.find((p) => p.codigo === 'MC-003')
    expect(imagenProducto(producto)).toBe(IMAGEN_FALLBACK)
  })

  it('usa la imagen de respaldo si la imagen asignada falla', () => {
    const producto = PRODUCTOS_INICIALES.find((p) => p.codigo === 'HM-001')
    const { container } = render(<ImagenProducto producto={producto} />)
    fireEvent.error(container.querySelector('img'))
    expect(container.querySelector('img')).toHaveAttribute('src', IMAGEN_FALLBACK)
  })
})
