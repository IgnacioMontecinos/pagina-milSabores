import { useState } from 'react'
import { IMAGEN_FALLBACK, imagenProducto } from '../imagenesProducto'

export default function ImagenProducto({ producto, alt }) {
  const url = imagenProducto(producto)
  const [urlConError, setUrlConError] = useState(null)
  const src = urlConError === url ? IMAGEN_FALLBACK : url

  return (
    <img
      src={src}
      alt={alt || producto?.nombre || 'Imagen de producto'}
      onError={() => setUrlConError(url)}
    />
  )
}
