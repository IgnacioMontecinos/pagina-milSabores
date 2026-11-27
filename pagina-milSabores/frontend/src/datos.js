export const CATEGORIAS = [
  'Herramientas Manuales',
  'Herramientas Eléctricas',
  'Materiales y Construcción',
  'Pinturas y Acabados',
]

export const PRODUCTOS_INICIALES = [
  { id: 1, codigo: 'HM-001', nombre: 'Martillo de acero 20 oz', descripcion: 'Mango de fibra de vidrio y cabeza forjada para trabajos de carpintería.', precio: 12990, stock: 12, critico: 3, categoria: 'Herramientas Manuales', imagenUrl: '/images/martillo_img.jpg' },
  { id: 2, codigo: 'HM-002', nombre: 'Serrucho de carpintero 20"', descripcion: 'Hoja de acero templado y mango ergonómico para cortes longitudinales.', precio: 9990, stock: 8, critico: 2, categoria: 'Herramientas Manuales', imagenUrl: '/images/serrucho__img.jpg' },
  { id: 3, codigo: 'HE-001', nombre: 'Taladro percutor 800 W', descripcion: 'Taladro con control de velocidad y mandril rápido de 13 mm.', precio: 59990, stock: 6, critico: 2, categoria: 'Herramientas Eléctricas', imagenUrl: '/images/taladro.svg' },
  { id: 4, codigo: 'HM-003', nombre: 'Serrucho de punta fina 12"', descripcion: 'Sierra manual de dientes finos para cortes precisos en madera.', precio: 7990, stock: 18, critico: 4, categoria: 'Herramientas Manuales', imagenUrl: '/images/serrucho__img.jpg' },
  { id: 5, codigo: 'HE-002', nombre: 'Motosierra eléctrica 1600 W', descripcion: 'Espada de 40 cm, freno de cadena y lubricación automática.', precio: 84990, stock: 5, critico: 2, categoria: 'Herramientas Eléctricas', imagenUrl: '/images/motosierra_img.jpg' },
  { id: 6, codigo: 'HE-003', nombre: 'Motosierra profesional 2000 W', descripcion: 'Motor de alta potencia con cadena de corte rápido para trabajos pesados.', precio: 109990, stock: 4, critico: 1, categoria: 'Herramientas Eléctricas', imagenUrl: '/images/motosierra_img.jpg' },
  { id: 7, codigo: 'MC-001', nombre: 'Cemento Portland 50 kg', descripcion: 'Cemento de uso general para morteros y concretos.', precio: 7990, stock: 30, critico: 8, categoria: 'Materiales y Construcción', imagenUrl: '/images/cemento.svg' },
  { id: 8, codigo: 'MC-002', nombre: 'Clavos galvanizados 1 kg', descripcion: 'Clavos de acero galvanizado para fijaciones en madera y muebles.', precio: 3290, stock: 45, critico: 10, categoria: 'Materiales y Construcción', imagenUrl: '/images/clavos_img.jpg' },
  { id: 9, codigo: 'MC-003', nombre: 'Tornillería mixta x 100', descripcion: 'Set de tornillos y tuercas galvanizadas para fijaciones.', precio: 4990, stock: 22, critico: 5, categoria: 'Materiales y Construcción', imagenUrl: '/images/clavos_img.jpg' },
  { id: 10, codigo: 'PA-001', nombre: 'Brocha profesional 2"', descripcion: 'Brocha de cerdas naturales para pinturas al óleo y esmaltes.', precio: 3990, stock: 25, critico: 6, categoria: 'Pinturas y Acabados', imagenUrl: '/images/pintura.svg' },
  { id: 11, codigo: 'PA-002', nombre: 'Rodillo con bandeja 9"', descripcion: 'Rodillo de espuma con bandeja para pintar superficies amplias.', precio: 6490, stock: 16, critico: 4, categoria: 'Pinturas y Acabados', imagenUrl: '/images/pintura.svg' },
  { id: 12, codigo: 'PA-003', nombre: 'Esmalte sintético 1 L', descripcion: 'Esmalte de alto brillo para metales y madera, secado rápido.', precio: 14990, stock: 10, critico: 3, categoria: 'Pinturas y Acabados', imagenUrl: '/images/pintura.svg' },
]

export const esProductoDeFerreteria = (p) => Boolean(p) && CATEGORIAS.includes(p.categoria)

export const USUARIOS_INICIALES = [
  { id: 1, username: 'admin', nombre: 'Administrador', password: 'Admin123!', correo: 'admin@ferreterialosmaestros.cl', rol: 'ROLE_ADMIN', authorities: ['ROLE_ADMIN'] },
  { id: 2, username: 'user', nombre: 'Cliente', password: 'User123!', correo: 'cliente@ferreterialosmaestros.cl', rol: 'ROLE_USER', authorities: ['ROLE_USER'] },
]

export const REGIONES = [
  { n: 'Metropolitana de Santiago', c: ['Santiago', 'Renca', 'Maipú', 'Providencia', 'Las Condes'] },
  { n: 'Valparaíso', c: ['Valparaíso', 'Viña del Mar', 'Quilpué'] },
  { n: 'Biobío', c: ['Concepción', 'Talcahuano', 'Los Ángeles'] },
]

export const money = (n) => '$' + Number(n).toLocaleString('es-CL')

export const emailOK = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(e).trim())

export function validarRun(run) {
  run = run.replace(/[.-]/g, '').toUpperCase()
  if (run.length < 7 || run.length > 9) return false
  const cuerpo = run.slice(0, -1)
  const dv = run.slice(-1)
  let s = 0
  let m = 2
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    s += Number(cuerpo[i]) * m
    m = m === 7 ? 2 : m + 1
  }
  const r = 11 - (s % 11)
  const calc = r === 11 ? '0' : r === 10 ? 'K' : String(r)
  return dv === calc
}

export const leer = (k, d) => {
  try {
    const v = JSON.parse(localStorage.getItem(k))
    return v ?? d
  } catch {
    return d
  }
}

export const guardar = (k, v) => localStorage.setItem(k, JSON.stringify(v))
