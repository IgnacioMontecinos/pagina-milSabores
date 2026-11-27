import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'

vi.stubGlobal('alert', vi.fn())
vi.stubGlobal('confirm', vi.fn(() => true))

beforeEach(() => {
  localStorage.clear()
  sessionStorage.clear()
  vi.stubGlobal('fetch', vi.fn(() => Promise.reject(new Error('Backend no disponible en pruebas'))))
})
