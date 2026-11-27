import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'

function LayoutPrincipal() {
  const { pathname } = useLocation()
  const esAdmin = pathname.startsWith('/admin')

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <>
      <Header esAdmin={esAdmin} />
      <main id="app">
        <Outlet />
      </main>
      <Footer />
    </>
  )
}

export default LayoutPrincipal
