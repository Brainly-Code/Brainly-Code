import React from 'react'
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useLogoutMutation } from '../redux/api/userSlice';
import { Logout } from '../redux/Features/authSlice';
import { toast } from 'react-toastify';
import { FloatingNav } from './ui/FloatingNav';
import BrainlyCodeIcon from './BrainlyCodeIcon';
import TextGenerateEffect from './ui/TextGenerate';
import CodeEditor from './CodeEditor';

const PlayGround = () => {

  const projects = [
    { title: "A function that prints the words of a string backwards" , descrption: "" },
    { title: "palindrome checker" , descrption: "" },
    { title: "Build a cat website" , descrption: "" },
  ]
  
  const navItems = [
    { name: "Courses", link: "/user", icon: "📚" },
    { name: "Playground", link: "/user/playground", icon: "🎮" },
    { name: "Challenges", link: "/user/challenges", icon: "🏆" },
    { name: "Community", link: "/user/community", icon: "👤"}
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
    <div className='bg-[#070045] m-0'>
      <div className=' opacity-90 h-[100%]'>
      <nav className=' border-gray-300 py-6 rounded-none border-b-2'>
        <header className="flex text-white justify-between">
              <FloatingNav navItems={navItems} />
              <BrainlyCodeIcon className="ml-7"/>
              <div className="hidden md:flex lg:gap-20 gap-10 flex-wrap justify-center mx-auto">
              <Link to="/user">
                <button className="text-sm text-gray-300 hover:text-white">Courses</button>
              </Link>
              <Link to="/user/playground">
                <button className="text-sm text-gray-300 hover:text-white">Playground</button>
              </Link>
              <Link to="/user/challenges">
                <button className="text-sm text-gray-300 hover:text-white">Challenges</button>
              </Link>
              <Link to="/user/community">
                <button className="text-sm text-gray-300 hover:text-white">Community</button>
              </Link>
            </div>
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
      <div className='w-full max-w-xl mt-8 text-center mx-auto px-4'>
        <h1 className="text-3xl md:text-4xl font-bold flex justify-center text-gray-300">
          <span className='mr-3 text-[#8F57EF]'>Code</span>
          <TextGenerateEffect className={"font-bold text-[#00DEDE]"} words={"Playground"} />
        </h1>
        <p className="text-gray-400 mt-4">
          Experiment with code, test your ideas and learn by doing in our interactive playground.
        </p>
      </div>
    </section>

    <section className="editor my-8 px-4 md:px-10">
      <CodeEditor />
    </section>

    <section className='text-gray-100 mt-16 mx-4 md:mx-10 lg:mx-32'>
      <h1 className='text-center text-xl md:text-2xl font-bold'>
        Here are some projects you might want to try out in the playground
      </h1>
      <div className='bg-[#161077] py-8 rounded-xl mt-8'>
        {projects.map((project, index) => (
          <div key={index} className="text-center py-2">
            <h2 className='text-lg md:text-xl font-semibold'>{project.title}</h2>
          </div>
        ))}
      </div>
    </section>
    </div>
    </div>
  )
}

export default PlayGround