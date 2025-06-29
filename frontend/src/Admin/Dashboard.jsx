import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom';
import { useLogoutMutation } from '../redux/api/userSlice';
import { Logout } from '../redux/Features/authSlice';
import { toast } from 'react-toastify';
import { FloatingNav } from '../Components/ui/FloatingNav';
import BrainlyCodeIcon from '../Components/BrainlyCodeIcon';

const Dashboard = () => {
  const userInfo = useSelector(state => state.auth);

  const navItems = [
    { name: "Courses", link: "/", icon: "📚" },
    { name: "Playground", link: "/playground", icon: "🎮" },
    { name: "Challenges", link: "/challenges", icon: "🏆" },
    { name: "Community", link: "/community", icon: "👤"}
  ];

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [ logoutApiCall ] = useLogoutMutation();
  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(Logout());
      navigate('/login');
    } catch (error) {
      toast.error(error?.data?.message || error.message);
    }
  }


  return (
    <div className='w-screen h-[40rem] bg-[#2b1edf] ' >
      <div className=' border-gray-300 py-6 rounded-none border-b-2'>
        <header className="flex text-white justify-between">
            <FloatingNav navItems={navItems} />
            <BrainlyCodeIcon className="ml-7 border-0"/>
            <ul className="ml-auto">
              <li className="font-semibold inline text-gray-300">
                  <Link to="/admin/profile">
                    <button >Profile</button>
                  </Link>
              </li>
              <li className="font-semibold inline bg-gradient-to-r from-[#00ffff] rounded-md ml-5 to-purple-400 px-5 py-2 text-gray-300">
                <button onClick={logoutHandler}>
                  <Link to="">
                   Sign out
                   </Link>
                </button>
              </li>
            </ul>
        </header>
      </div>
      
      <div className="bg-[#110b63] h-[5rem]">
        <h1 className="text-3xl font-semibold text-center text-[#647ff7] ">
          Welcome back
          {  userInfo ? <p>{userInfo.access_token}</p> : <p>Checking</p>  }
        </h1>
      </div>

      <div className="m-auto w-[80%]  mt-[2rem] bg-[#0d0e70] opacity-50 rounded-lg p-4 ">
            <div className='border-gray-500 w-[30%] border'>
              <Link className='text-xl font-semibold' to="/admin/courses">
                <p className='hover:text-[#8b92bb] text-[#bcc4f5] m-4 '>Courses</p>
                <p className="text-xs m-[1rem] text-gray-300  font-normal">Click to edit, update and remove courses</p>
              </Link>
            </div>
        </div>
    </div>
  )
}

export default Dashboard
