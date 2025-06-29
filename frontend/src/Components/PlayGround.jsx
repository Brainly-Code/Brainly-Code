import React from 'react'
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useLogoutMutation } from '../redux/api/userSlice';
import { Logout } from '../redux/Features/authSlice';
import { toast } from 'react-toastify';
import { FloatingNav } from './ui/FloatingNav';
import BrainlyCodeIcon from './BrainlyCodeIcon';
import TextGenerateEffect from './ui/TextGenerate';

const PlayGround = () => {
  
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
      navigate('login');
    } catch (error) {
      toast.error(error?.data?.message || error.message);
    }
  }

  return (
    <div>
      <div className='bg-[#070045] opacity-90 h-screen'>
      <nav className=' border-gray-300 py-6 rounded-none border-b-2'>
        <header className="flex text-white justify-between">
              <FloatingNav navItems={navItems} />
              <BrainlyCodeIcon className="ml-7"/>
              <ul className="ml-auto">
                <li className="font-semibold inline text-gray-300">
                    <Link to="/profile">
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
      </nav>
      <section>
        <div className='w-[30%] mt-[2rem]  text-center mx-auto'>
          <h1 className="text-4xl ml-[3rem] text-center font-bold flex text-gray-300">
          <span className='mr-4 text-[#8F57EF] mt-0.5'>Code</span>
            <TextGenerateEffect className={"font-bold text-[#00DEDE]"} words={"Playground"} />
            </h1>
            <p className="text-gray-400">
              Experiment with code, test your ideas and learn by doing in our interactive
              playground.
            </p>
        </div>
      </section>
    </div>
    </div>
  )
}

export default PlayGround
