import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import Registro from './Registro'
import { TiendaProvider } from '../tienda'

function renderizarRegistro() {
  return render(
    <TiendaProvider>
      <MemoryRouter>
        <Registro />
      </MemoryRouter>
    </TiendaProvider>,
  )
}

async function llenarCamposObligatorios(container) {
  // RUN válido y corto para respetar el maxLength de 9 del campo
  await userEvent.type(container.querySelector('#run'), '1234567-4')
  await userEvent.type(container.querySelector('#nombre'), 'Ana')
  await userEvent.type(container.querySelector('#apellidos'), 'Pérez Soto')
  await userEvent.type(container.querySelector('#correo'), 'ana@gmail.com')
  await userEvent.type(container.querySelector('#password'), '1234')
  await userEvent.type(container.querySelector('#direccion'), 'Calle Falsa 123')
}

describe('Registro', () => {
  it('pide seleccionar una región cuando no está elegida', async () => {
    const { container } = renderizarRegistro()
    await llenarCamposObligatorios(container)
    await userEvent.click(screen.getByRole('button', { name: 'Guardar' }))
    expect(screen.getByText('Debe seleccionar una región')).toBeInTheDocument()
  })

  it('pide seleccionar una comuna cuando falta la comuna', async () => {
    const { container } = renderizarRegistro()
    await llenarCamposObligatorios(container)
    await userEvent.selectOptions(container.querySelector('#region'), 'Metropolitana de Santiago')
    await userEvent.click(screen.getByRole('button', { name: 'Guardar' }))
    expect(screen.getByText('Debe seleccionar una comuna')).toBeInTheDocument()
  })

  it('registra al usuario cuando región y comuna están seleccionadas', async () => {
    const { container } = renderizarRegistro()
    await llenarCamposObligatorios(container)
    await userEvent.selectOptions(container.querySelector('#region'), 'Metropolitana de Santiago')
    await userEvent.selectOptions(container.querySelector('#comuna'), 'Santiago')
    await userEvent.click(screen.getByRole('button', { name: 'Guardar' }))
    expect(screen.getByText('Registro exitoso')).toBeInTheDocument()
    const guardados = JSON.parse(localStorage.getItem('usuarios'))
    expect(guardados.some((u) => u.correo === 'ana@gmail.com' && u.comuna === 'Santiago')).toBe(true)
  })
})
