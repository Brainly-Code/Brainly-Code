import React, {useState} from 'react';
import { useParams } from 'react-router-dom';
import { useGetVideoByIdQuery } from '../redux/api/videoApi'; 
import Loader from './ui/Loader';
import Footer from './ui/Footer';
import { FloatingNav } from './ui/FloatingNav';
import BrainlyCodeIcon from './BrainlyCodeIcon';
import profile from '../assets/profile.png';
import { useLogoutMutation } from '../redux/api/userSlice';
import { useDispatch } from 'react-redux';
import { Logout } from '../redux/Features/authSlice';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';



const VideoPlayer = () => {
  const { videoId } = useParams();
  const { data: video, error, isLoading } = useGetVideoByIdQuery(videoId);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [logoutApiCall] = useLogoutMutation();
  
  const [progress, setProgress] = useState(0); 

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(Logout());
      navigate('/login');
    } catch (error) {
      toast.error(error?.data?.message || error.message);
    }
  };

  const handleTimeUpdate = (e) => {
    const currentTime = e.target.currentTime;
    const duration = e.target.duration;
    const percent = duration ? Math.round((currentTime / duration) * 100) : 0;
    setProgress(percent);
  };

  if (isLoading) return <Loader />;
  if (error) {
    toast.error(error?.data?.message || 'Error loading video');
    return null;
  }

  return (
    <div className='bg-[#070045]'>
      {/* Header */}
      <nav className='border-gray-300 py-6 rounded-none border-b-2'>
        <header className="flex items-center mx-auto text-white w-5/6 justify-between">
          <FloatingNav navItems={[/* same nav items */]} />
          <BrainlyCodeIcon className="ml-7" />
          <ul className="flex items-center h-1/4">
            <li>
              <Link to="/user/profile">
                <img src={profile} className='h-1/2 w-1/2 md:h-3/4 md:w-3/4' />
              </Link>
            </li>
            <li className="font-semibold inline bg-gradient-to-r from-[#00ffff] rounded-3xl ml-5 to-purple-400 px-5 py-2 text-gray-300">
              <button onClick={logoutHandler}>Sign out</button>
            </li>
          </ul>
        </header>
      </nav>

      {/* Video */}
      <section className='flex flex-col gap-10 w-full'>
        <h2 className='text-white mt-10 text-center text-sm md:text-lg font-bold'>
          {video?.title || 'Video'}
        </h2>
        <div className='w-3/4 h-96 bg-[#216FB8] mx-auto flex justify-center items-center rounded-lg overflow-hidden'>
          <video
            className="w-full h-full object-cover"
            controls
            src={video?.url}
            onTimeUpdate={handleTimeUpdate}
          >
            Your browser does not support the video tag.
          </video>
        </div>

        <div className='mx-auto flex flex-col gap-2 bg-[#0A1C2B] py-6 px-40 rounded-2xl'>
          <span className='text-white'>You are {progress}% there!</span>
          <button className='text-white bg-[rgba(33,111,182,0.25)] rounded-2xl p-1'>Continue</button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default VideoPlayer;