import React, { useEffect, useState } from 'react'
import { useCreateLessonProgressMutation, useGetLessonProgressQuery, useTrackLessonProgressMutation } from '../../redux/api/progressSlice';
import { useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';
import Loader from './Loader';
import { Link, Navigate, useParams } from 'react-router-dom';

const Progress = () => {
  const [startingProgress, setStartingProgress] = useState(true);
  const [percentage, setPercentage] = useState(0);

  const lesson = useParams();
  const lessonId = Number(lesson.id);
 
  const [ startProgress, {isLoading} ] = useCreateLessonProgressMutation();
  const [ trackProgress ] = useTrackLessonProgressMutation();
  const {data: lessonProgress} = useGetLessonProgressQuery(lessonId);
  const {userInfo} = useSelector(state => state.auth);
  const token = jwtDecode(userInfo?.access_token);
  const userId = token.sub;

  useEffect(()=>{
    if(lessonProgress?.currentStep === 0 ) {
      setStartingProgress(true);
    }else{
      setStartingProgress(false);
    }
  }, [lessonProgress]);
  
  
  const  handleStartLessonProgress = async () => {

    try {
      const res = await startProgress({ userId, lessonId }).unwrap();
      console.log(res);
      setPercentage(( lessonProgress?.data[0].currentStep / res.Lessons) * 100);
      setStartingProgress(false);
      toast.success("That was correct");
    } catch (error) {
      toast.error(error?.data?.message);
      console.log(error);
    }
  }

  const handleTrackLessonProgress = async() => {
    try {
      const res = await trackProgress(lessonProgress?.data[0]?.id, { lesson }).unwrap();
      setPercentage(( lessonProgress?.data[0].currentStep / res.Lessons ) * 100);
    } catch (error) {
     console.log(error);
     toast.error 
    }
  }

  if(percentage > 100) {
    setPercentage(100);
  }

  if(isLoading) <Loader className="mx-auto" />



  return (
    <div>
      <div className='mx-auto rounded-lg mt-[4rem] p-4 bg-[#0A1C2B] w-[25rem]'>
        { 
          <p className='text-gray-300 text-center text-lg'>You are {percentage}% there</p>
        }
        {
          startingProgress === true ? (
            <button onClick={handleStartLessonProgress} className="rounded-3xl ml-[38%] hover:bg-opacity-35 mt-2 py-2 px-4 text-gray-300 bg-opacity-25 bg-[#216FB8]">Check</button>

          ) : (
            percentage < 100 ? (
              <button onClick={handleTrackLessonProgress} className="rounded-3xl ml-[38%] hover:bg-opacity-35 mt-2 py-2 px-4 text-gray-300 bg-opacity-25 bg-[#216FB8]">Continue</button>
            ) : (
              <Link
                to={`/user/lesson/${lessonId}`}
              >
                <button 
                  className="rounded-3xl ml-[38%] hover:bg-opacity-35 mt-2 py-2 px-7 text-gray-300 bg-opacity-25 bg-[#216FB8]"
                >
                  Next
                </button>
              </Link>
            )
          )
        }
      </div>
    </div>
  )
}

export default Progress
