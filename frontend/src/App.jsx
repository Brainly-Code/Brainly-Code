import { Outlet } from "react-router-dom"
import { ToastContainer } from 'react-toastify'

const App = () => {
  return ( 
    <div>
      <ToastContainer />
      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default App