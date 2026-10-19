import { useState } from 'react'
import { money } from '../datos'
import { useTienda } from '../useTienda'

function Carrito() {
  const { carrito, productos, quitarDelCarrito, cambiarCantidad, finalizarCompra } = useTienda()
  const [msg, setMsg] = useState({ texto: '', ok: false })

  const pagar = () => {
    const r = finalizarCompra()
    if (r.ok) setMsg({ texto: '¡Compra realizada! Gracias por su pedido.', ok: true })
    else setMsg({ texto: r.error, ok: false })
  }

  if (!carrito.length) {
    return (
      <>
        <h1>Mi carrito</h1>
        {msg.texto && <p className={msg.ok ? 'msg ok' : 'msg'}>{msg.texto}</p>}
        <p>Tu carrito está vacío.</p>
      </>
    )
  }

  const total = carrito.reduce((t, x) => {
    const p = productos.find((y) => y.id === x.id)
    return p ? t + p.precio * x.cantidad : t
  }, 0)

  return (
    <>
      <h1>Mi carrito de compras</h1>

      {carrito.map((x) => {
        const p = productos.find((y) => y.id === x.id)
        if (!p) return null
        return (
          <div className="cart-item" key={x.id}>
            <img src={p.img} alt={p.nombre} />
            <div>
              <h3>{p.nombre}</h3>
              <p>{money(p.precio)}</p>
              <button onClick={() => cambiarCantidad(p.id, -1)}>−</button>
              <b>{x.cantidad}</b>
              <button onClick={() => cambiarCantidad(p.id, 1)}>+</button>
            </div>
            <button onClick={() => quitarDelCarrito(p.id)}>Eliminar</button>
          </div>
        )
      })}

      <p className="total">Total: {money(total)}</p>
      <button onClick={pagar}>Pagar</button>
    </>
  )
}

export default Carrito
