import React from 'react'
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useLogoutMutation } from '../redux/api/userSlice';
import { Logout } from '../redux/Features/authSlice';
import { toast } from 'react-toastify';
import { FloatingNav } from './ui/FloatingNav';
import BrainlyCodeIcon from './BrainlyCodeIcon';
import TextGenerateEffect from './ui/TextGenerate';
import Loader from './ui/Loader';
import { useGetChallengesQuery } from '../redux/api/challengeSlice';
import { BackgroundGradient } from './ui/BgGradient';

export const Challenges = () => {
  
  let { data: challenges, error, isLoading } = useGetChallengesQuery();
  console.log(challenges);
  
  if(error){
    toast.error(error);
  }

  const [filterLevel, setFilterLevel] = React.useState('ALL');

  const filteredChallenges = filterLevel === 'ALL' 
  ? challenges
  : challenges?.filter(challenge => challenge.difficulty === filterLevel);


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

  if(isLoading) {
    return <Loader />
  }

  return (
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
            <span className='mr-4 mt-0.5'>Coding</span>
            <TextGenerateEffect className={"font-bold text-[#03C803]"} words={"Challenges"} />
            </h1>
            <p className="text-gray-400">
              Test your skills, solve problems and compete with others through our interactive
              coding challenges..
            </p>
        </div>
      </section>

      <section className="m-10">
        <div className="m-10">
          <button
            onClick={() => setFilterLevel('Easy')}
            className='py-2 px-5 hover:bg-opacity-65 inline border bg-[#19cf56] bg-opacity-50 text-[#20ec3b] mr-[10rem] border-gray-500 rounded-md'>
            Easy
          </button>
          <button
            onClick={() => setFilterLevel('Medium')}
            className='py-2 px-5 hover:bg-opacity-65 inline border bg-[#FFA500] bg-opacity-50 text-[#FFa500] mr-[10rem] rounded-md'>
            Medium
          </button>
          <button
            onClick={() => setFilterLevel('Hard')}
            className='py-2 px-5 hover:bg-opacity-65 inline border bg-[#F59898] bg-opacity-50 text-[#FF0000]  mr-[10rem] rounded-md'>
            Hard
          </button>
        </div>
      </section>

      <section>

      <div>
        
      </div>

      <div className=" mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-[5rem]">
            {filteredChallenges?.map((challenge) => (
              <div className='' key={challenge._id || challenge.id}>
                <BackgroundGradient className="h-[40%] rounded-[22px] p-4 sm:p-8 bg-white dark:bg-zinc-900" animate="true">
                  <div className="flex justify-between items-center mb-4">
                    {}
                    <span className="text-[#A241E9] font-bold">{challenge.difficulty}</span>
                  </div>

                  <h1 className="text-2xl font-bold text-neutral-300 dark:text-neutral-200">
                    {challenge.title}
                  </h1>
                  <p className="text-gray-600">{challenge.description}</p>

                  <button
                    className="rounded-full ml-[30%] bg-gradient-to-r from-[#00ffee] to-purple-500 px-5 py-2 text-white font-bold text-sm mt-4">
                    Start
                  </button>
                </BackgroundGradient>
              </div>
            ))}
          </div>

        </div>
      </section>
    </div>
  )
}

export default Challenges
