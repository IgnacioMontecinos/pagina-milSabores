import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import FormularioProductoAdmin from './FormularioProductoAdmin'
import { TiendaProvider } from '../tienda'

function renderizarFormulario() {
  return render(
    <TiendaProvider>
      <MemoryRouter initialEntries={['/admin/producto-form']}>
        <Routes>
          <Route path="/admin/producto-form" element={<FormularioProductoAdmin />} />
          <Route path="/admin/productos" element={<h1>Lista de productos</h1>} />
        </Routes>
      </MemoryRouter>
    </TiendaProvider>,
  )
}

describe('FormularioProductoAdmin', () => {
  it('muestra un error si el código tiene menos de 3 caracteres', async () => {
    const { container } = renderizarFormulario()
    await userEvent.type(container.querySelector('#codigo'), 'AB')
    await userEvent.type(container.querySelector('#nombre'), 'Torta Especial')
    await userEvent.type(container.querySelector('#precio'), '15000')
    await userEvent.type(container.querySelector('#stock'), '4')
    await userEvent.click(screen.getByRole('button', { name: 'Guardar' }))
    expect(screen.getByText('El código debe tener mínimo 3 caracteres')).toBeInTheDocument()
  })

  it('muestra un error si el stock no es un número entero', async () => {
    const { container } = renderizarFormulario()
    await userEvent.type(container.querySelector('#codigo'), 'TOR009')
    await userEvent.type(container.querySelector('#nombre'), 'Torta Especial')
    await userEvent.type(container.querySelector('#precio'), '15000')
    await userEvent.type(container.querySelector('#stock'), '4.5')
    // Se envía el formulario directamente: la validación nativa del navegador
    // impediría el envío antes de que corra la validación propia de React
    fireEvent.submit(container.querySelector('#productForm'))
    expect(screen.getByText('Stock inválido')).toBeInTheDocument()
  })

  it('guarda un producto válido y vuelve a la lista', async () => {
    const { container } = renderizarFormulario()
    await userEvent.type(container.querySelector('#codigo'), 'TOR009')
    await userEvent.type(container.querySelector('#nombre'), 'Torta Especial')
    await userEvent.type(container.querySelector('#descripcion'), 'Torta de prueba para el examen.')
    await userEvent.type(container.querySelector('#precio'), '15000')
    await userEvent.type(container.querySelector('#stock'), '4')
    await userEvent.click(screen.getByRole('button', { name: 'Guardar' }))
    expect(screen.getByText('Lista de productos')).toBeInTheDocument()
    const guardados = JSON.parse(localStorage.getItem('productos'))
    expect(guardados.some((p) => p.codigo === 'TOR009' && p.stock === 4)).toBe(true)
  })
})
