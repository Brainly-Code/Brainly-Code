import React from 'react'
import { Logout } from '../redux/Features/authSlice';
import { toast } from 'react-toastify';
import { FloatingNav } from './ui/FloatingNav';
import BrainlyCodeIcon from './BrainlyCodeIcon';
import TextGenerateEffect from './ui/TextGenerate';
import Loader from './ui/Loader';
import { useGetChallengesQuery, useToggleChallengeLikeMutation } from '../redux/api/challengeSlice';
import { BackgroundGradient } from './ui/BgGradient';
import Footer from './ui/Footer';
import Header from './ui/Header';
import { Link } from 'react-router-dom';
import BgLoader from './ui/BgLoader';
import like from '../assets/like.png'
import liked from '../assets/liked.png'
import { jwtDecode } from 'jwt-decode';
import { useSelector } from 'react-redux';

export const Challenges = () => {
  
  let { data: challenges, error, isLoading } = useGetChallengesQuery();
  const [toggleLike] = useToggleChallengeLikeMutation();
  const [challengesState, setChallengesState] = React.useState([]);

  console.log(challenges);

  const { userInfo } = useSelector((state) => state.auth);
  const token = jwtDecode(userInfo.access_token);

    React.useEffect(() => {
    if (challenges) {
      const challengesWithLikeStatus = challenges.map(ch => {
        const userHasLiked = ch.likesList?.some(like => like.userId === token.sub) || false;
        return { ...ch, userHasLiked };
      });
      setChallengesState(challengesWithLikeStatus);
    }
  }, [challenges, token.sub]);

  
  if(error){
    toast.error(error);
  }

  const [filterLevel, setFilterLevel] = React.useState('ALL');

  const filteredChallenges = filterLevel === 'ALL' 
    ? challengesState
    : challengesState?.filter(challenge => challenge.difficulty === filterLevel);

  
  const handleLikeClick = async (challengeId) => {
    try {
      const res = await toggleLike({ id: challengeId, userId: token.sub }).unwrap();
      toast.success(res.message);

      setChallengesState(prev =>
        prev.map(ch => {
          if (ch.id === challengeId) {
            const likes = res.liked ? ch.likes + 1 : ch.likes - 1;
            return { ...ch, userHasLiked: res.liked, likes };
          }
          return ch;
        })
      );
    } catch (err) {
      toast.error("Failed to like challenge");
    }
  };


  if(isLoading) {
    return <BgLoader />
  }

  return (
    <div className='bg-[#070045] opacity-90 h-full'>
      <Header />
     <section>
        <div className='mt-[2rem] w-full md:w-[50%] px-4 text-center mx-auto'>
          <h1 className="text-2xl md:text-4xl text-center font-bold flex justify-center text-gray-300">
            <span className='mr-2 md:mr-4 mt-0.5 text-white'>Coding</span>
            <TextGenerateEffect className="font-bold text-[#03C803]" words={"Challenges"} />
          </h1>
          <p className="text-gray-400 text-sm md:text-base mt-2">
            Test your skills, solve problems and compete with others through our interactive
            coding challenges.
          </p>
        </div>
      </section>

        <section className="px-4 sm:px-8 lg:px-20 mt-6">
          {/* Filters aligned to first card */}
          <div className="mb-8">
            <div className="flex gap-2">
              <button
                onClick={() => setFilterLevel('Easy')}
                className=" py-2 px-5 hover:bg-opacity-65 border bg-[#19cf56] bg-opacity-50 text-[#20ec3b] border-gray-500 rounded-md"
              >
                Easy
              </button>
              <button
                onClick={() => setFilterLevel('Medium')}
                className=" py-2 px-5 hover:bg-opacity-65 border bg-[#FFA500] bg-opacity-50 text-[#FFa500] rounded-md"
              >
                Medium
              </button>
              <button
                onClick={() => setFilterLevel('Hard')}
                className="py-2 px-5 hover:bg-opacity-65 border bg-[#F59898] bg-opacity-50 text-[#FF0000] rounded-md"
              >
                Hard
              </button>
            </div>
          </div>

          {/* Challenges grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-14 mb-12">
            {filteredChallenges?.map((challenge) => (
              <div key={challenge._id || challenge.id}>
                <div className="h-full rounded-[22px] p-4 sm:p-6 lg:p-8 bg-opacity-0 shadow-[0_0px_4px_10px_rgba(33,111,184,0.25)]">
                  <div className="flex justify-between items-center mb-4">
                    <span
                      className={`text-md font-bold px-2 py-1 rounded-md ${
                        challenge.difficulty === 'Easy'
                          ? 'bg-[rgba(63,101,58,0.69)] text-[#01FE01]'
                          : challenge.difficulty === 'Medium'
                          ? 'bg-[rgba(255,208,51,0.57)] text-[#FFA500]'
                          : challenge.difficulty === 'Hard'
                          ? 'bg-[#F59898] text-[rgba(255,0,0,0.89)]'
                          : 'bg-gray-200 text-gray-800'
                      }`}
                    >
                      {challenge.difficulty}
                    </span>
                  </div>

                  <h1 className="text-xl sm:text-2xl font-bold text-neutral-300 dark:text-neutral-200">
                    {challenge.title}
                  </h1>
                  <p className="text-gray-400 text-sm sm:text-base">{challenge.description}</p>

                  <div className="flex justify-around h-1/6 mt-6">
                  <img 
                     src={challenge.userHasLiked ? liked : like}
                   className='h-6 w-6 cursor-pointer'
                   onClick={() => handleLikeClick(challenge.id)}/>
                    <Link to={`/user/challenge/${challenge.id}`}>
                      <button className="rounded-lg hover:bg-[#06325b96] bg-[#06325B] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] py-2 px-8 text-white font-bold text-sm">
                        Start
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      <Footer/>
    </div>
  )
}

export default Challenges
