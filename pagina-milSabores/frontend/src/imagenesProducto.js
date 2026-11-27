import martillo from './assets/martillo_img.jpg'
import serrucho from './assets/serrucho__img.jpg'
import taladro from './assets/taladro percutor.jpg'
import motosierra from './assets/motosierra_img.jpg'
import cemento from './assets/cemento.jpg'
import clavos from './assets/clavos_img.jpg'
import brocha from './assets/brochaa.jpg'
import rodillo from './assets/rodillo.jpg'
import esmalte from './assets/esmalte sintetico.jpg'

export const IMAGEN_FALLBACK = '/images/herramienta.svg'

export const IMAGENES_PRODUCTO = {
  'HM-001': martillo,
  'HM-002': serrucho,
  'HM-003': serrucho,
  'HE-001': taladro,
  'HE-002': motosierra,
  'HE-003': motosierra,
  'MC-001': cemento,
  'MC-002': clavos,
  'PA-001': brocha,
  'PA-002': rodillo,
  'PA-003': esmalte,
}

const IMAGENES_POR_NOMBRE = [
  [/martillo/i, martillo],
  [/serrucho/i, serrucho],
  [/taladro/i, taladro],
  [/motosierra/i, motosierra],
  [/cemento/i, cemento],
  [/clavos?/i, clavos],
  [/brocha/i, brocha],
  [/rodillo/i, rodillo],
  [/esmalte/i, esmalte],
]

export function imagenProducto(producto) {
  if (!producto) return IMAGEN_FALLBACK

  const porCodigo = IMAGENES_PRODUCTO[producto.codigo]
  if (porCodigo) return porCodigo

  if (/tornill/i.test(producto.nombre || '')) return IMAGEN_FALLBACK

  const porNombre = IMAGENES_POR_NOMBRE.find(([expresion]) => expresion.test(producto.nombre || ''))
  if (porNombre) return porNombre[1]

  return producto.imagenUrl || IMAGEN_FALLBACK
}
