export const PRODUCTOS_INICIALES = [
  { id: 1, codigo: 'TOR001', nombre: 'Torta de Chocolate', descripcion: 'Torta artesanal de chocolate con suave relleno de crema.', precio: 18990, stock: 12, critico: 3, categoria: 'Tortas', img: '/torta-chocolate.jpg' },
  { id: 2, codigo: 'TOR002', nombre: 'Torta de Frutilla', descripcion: 'Bizcocho suave con crema y frutillas frescas.', precio: 19990, stock: 8, critico: 2, categoria: 'Tortas', img: '/torta-frutilla.jpg' },
  { id: 3, codigo: 'PAS001', nombre: 'Cheesecake', descripcion: 'Cheesecake cremoso con base de galleta.', precio: 14990, stock: 9, critico: 2, categoria: 'Pasteles', img: '/cheesecake.jpg' },
  { id: 4, codigo: 'PAS002', nombre: 'Pie de Limón', descripcion: 'Pie artesanal con crema de limón y merengue.', precio: 12990, stock: 15, critico: 3, categoria: 'Pasteles', img: '/pie-limon.jpg' },
  { id: 5, codigo: 'DUL001', nombre: 'Cupcakes', descripcion: 'Caja de seis cupcakes decorados.', precio: 9990, stock: 20, critico: 5, categoria: 'Dulces', img: '/cupcakes.jpg' },
  { id: 6, codigo: 'DUL002', nombre: 'Alfajores', descripcion: 'Caja de alfajores rellenos con manjar.', precio: 7990, stock: 25, critico: 5, categoria: 'Dulces', img: '/alfajores.jpg' },
]

export const USUARIOS_INICIALES = [
  { id: 1, run: '', nombre: 'Administrador', apellidos: 'Mil Sabores', correo: 'admin@duoc.cl', password: '1234', fecha: '', rol: 'Administrador', region: '', comuna: '', direccion: 'Pastelería Mil Sabores' },
  { id: 2, run: '', nombre: 'Vendedor', apellidos: 'Mil Sabores', correo: 'vendedor@duoc.cl', password: '1234', fecha: '', rol: 'Vendedor', region: '', comuna: '', direccion: 'Pastelería Mil Sabores' },
]

export const REGIONES = [
  { n: 'Metropolitana de Santiago', c: ['Santiago', 'Renca', 'Maipú', 'Providencia', 'Las Condes'] },
  { n: 'Valparaíso', c: ['Valparaíso', 'Viña del Mar', 'Quilpué'] },
  { n: 'Biobío', c: ['Concepción', 'Talcahuano', 'Los Ángeles'] },
]

/* REEMPLAZAR REGIONES POR EL ARREGLO OFICIAL ENTREGADO POR EL DOCENTE */

export const money = (n) => '$' + Number(n).toLocaleString('es-CL')

export const emailOK = (e) => /^[^\s@]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i.test(e)

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
