import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Bootstrap se carga primero; el diseño visual principal sigue siendo src/style.css
import 'bootstrap/dist/css/bootstrap.min.css'
import './style.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
