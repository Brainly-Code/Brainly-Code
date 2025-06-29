import { Outlet } from "react-router-dom"
import { ToastContainer } from 'react-toastify'

const User = () => {
  return (
    <div>
      <ToastContainer />
      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default User