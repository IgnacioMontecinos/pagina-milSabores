import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Contacto from './Contacto'

function renderizarContacto() {
  return render(<Contacto />)
}

describe('Contacto', () => {
  it('muestra un error si el nombre esta vacio', async () => {
    renderizarContacto()
    await userEvent.click(screen.getByRole('button', { name: 'Enviar mensaje' }))
    expect(screen.getByText('El nombre es obligatorio')).toBeInTheDocument()
  })

  it('muestra un error si el comentario esta vacio', async () => {
    const { container } = renderizarContacto()
    await userEvent.type(container.querySelector('#nombre'), 'Ana')
    await userEvent.click(screen.getByRole('button', { name: 'Enviar mensaje' }))
    expect(screen.getByText('El comentario es obligatorio')).toBeInTheDocument()
  })

  it('confirma el envio con datos validos', async () => {
    const { container } = renderizarContacto()
    await userEvent.type(container.querySelector('#nombre'), 'Ana')
    await userEvent.type(container.querySelector('#correo'), 'ana@gmail.com')
    await userEvent.type(container.querySelector('#comentario'), 'Hola, quiero una torta.')
    await userEvent.click(screen.getByRole('button', { name: 'Enviar mensaje' }))
    expect(screen.getByText('Mensaje enviado correctamente')).toBeInTheDocument()
  })
})
