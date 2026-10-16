import Encabezado from './components/Encabezado'
import PiePagina from './components/PiePagina'
import Inicio from './pages/Inicio'

function App() {
  return (
    <>
      <Encabezado />
      <main id="app">
        <Inicio />
      </main>
      <PiePagina />
    </>
  )
}

export default App
