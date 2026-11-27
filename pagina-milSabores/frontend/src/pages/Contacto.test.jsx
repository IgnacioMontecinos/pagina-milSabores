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
    await userEvent.click(screen.getByRole('button', { name: 'Enviar consulta' }))
    expect(screen.getByText('El nombre es obligatorio')).toBeInTheDocument()
  })

  it('muestra un error si la consulta esta vacia', async () => {
    const { container } = renderizarContacto()
    await userEvent.type(container.querySelector('#nombre'), 'Ana')
    await userEvent.click(screen.getByRole('button', { name: 'Enviar consulta' }))
    expect(screen.getByText('La consulta es obligatoria')).toBeInTheDocument()
  })

  it('muestra un error si el correo no es valido', async () => {
    const { container } = renderizarContacto()
    await userEvent.type(container.querySelector('#nombre'), 'Ana')
    await userEvent.type(container.querySelector('#correo'), 'sin-correo')
    await userEvent.type(container.querySelector('#comentario'), 'Necesito una cotización.')
    await userEvent.click(screen.getByRole('button', { name: 'Enviar consulta' }))
    expect(screen.getByText('Ingrese un correo válido')).toBeInTheDocument()
  })

  it('confirma el envio con datos validos', async () => {
    const { container } = renderizarContacto()
    await userEvent.type(container.querySelector('#nombre'), 'Ana')
    await userEvent.type(container.querySelector('#correo'), 'ana@gmail.com')
    await userEvent.type(container.querySelector('#comentario'), 'Hola, quiero cotizar taladros.')
    await userEvent.click(screen.getByRole('button', { name: 'Enviar consulta' }))
    expect(screen.getByText('Consulta enviada. Te contactaremos con tu cotización.')).toBeInTheDocument()
  })
})
