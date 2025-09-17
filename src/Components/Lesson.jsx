import React, { useEffect } from 'react'
import { toast } from 'react-toastify';
import { Logout } from '../redux/Features/authSlice';
import Loader from './ui/Loader';
import { FloatingNav } from './ui/FloatingNav';
import BrainlyCodeIcon from './BrainlyCodeIcon';
import CodeEditor from './CodeEditor';
import Footer from './ui/Footer';
import Progress from './ui/Progress';
import { useGetLessonByIdQuery } from '../redux/api/LessonSlice';
import Header from './ui/Header';
import { useParams } from 'react-router-dom';
import { useCreateMiniModuleMutation } from '../redux/api/subModuleSlice';
import { useCreateCourseProgressMutation, useCreateModuleProgressMutation, useGetCourseProgressQuery, useGetLessonProgressQuery, useGetMiniModuleProgressQuery, useGetModuleProgressQuery, useTrackCourseProgressMutation, useTrackMiniModuleProgressMutation, useTrackModuleProgressMutation } from '../redux/api/progressSlice';
import { useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';

const courseId = 3;
const moduleId = 14;
const miniModuleId = 9;
const Lesson = (
// {  
//   courseId,
//   moduleId,
//   miniModuleId
// }
) => {


  const { id } = useParams();
  const lessonId = id.id;
  const { userInfo } = useSelector(state => state.auth);
  const userId = userInfo?.sub;

  const [startMiniModuleProgress] = useCreateMiniModuleMutation();
  const [startModuleProgress] = useCreateModuleProgressMutation();
  const [startCourseProgress] = useCreateCourseProgressMutation();
  const [trackMiniModuleProgress] = useTrackMiniModuleProgressMutation();
  const [trackModuleProgress] = useTrackModuleProgressMutation();
  const [trackCourseProgress] = useTrackCourseProgressMutation();
  const { data: lessonProgress } = useGetLessonProgressQuery(lessonId);
  const { data: moduleProgress } = useGetModuleProgressQuery(moduleId);
  const { data: miniModuleProgress } = useGetMiniModuleProgressQuery(miniModuleId);
  const { data: courseProgress } = useGetCourseProgressQuery(courseId);

  useEffect(() => {
    if (!miniModuleProgress && !moduleProgress && !courseProgress) {
      (async () => {
        try {
          await startMiniModuleProgress({userId, miniModuleId }).unwrap();
          await startModuleProgress({userId, moduleId }).unwrap();
          await startCourseProgress({userId, courseId }).unwrap();
          toast.success("Course started");
        } catch (error) {
          console.log(error);
          toast.error(error?.data?.message);
        }
      })();
    }
  }, [miniModuleProgress, moduleProgress, courseProgress, startMiniModuleProgress, startModuleProgress, startCourseProgress, userId]);
  

  useEffect(() => {
    if( lessonProgress?.data[0]?.completed === true ) {
      if(courseProgress && moduleProgress && miniModuleProgress) {
      (async () => {
        try {
          await trackMiniModuleProgress(miniModuleProgress?.data[0]?.id, {miniModuleId}).unwrap();
          await trackModuleProgress(moduleProgress?.data[0]?.id, {moduleId}).unwrap();
          await trackCourseProgress(courseProgress?.data[0]?.id, {courseId}).unwrap();
        } catch (error) {
          console.log(error);
          toast.error(error?.data?.message);
        }
      })()
    }}
  }, [courseProgress, moduleProgress, miniModuleProgress, lessonProgress, trackMiniModuleProgress, trackModuleProgress, trackCourseProgress]
)
  
  const { data: lesson, error, isLoading } = useGetLessonByIdQuery(id);
  
  if(error){
    toast.error(error);
  }
  
  if(isLoading) {
    return <Loader/>
  }

  return (
    <div className='bg-[#0D0056] w-full'>
      <div className='py-6 rounded-none'>
        <Header />
      </div> 

      <div className="text-center">
        <h1 className='text-3xl font-bold text-gray-200 m-[1rem]'>Basics of HTML</h1>
        <div className="bg-[#216FB8] bg-opacity-25  mx-[7rem] p-[3rem]">
          <h2 className="text-gray-300 mb-[1rem] font-bold text-lg">{lesson?.id}. {lesson?.title}</h2>
          <p className="text-gray-400 text-md">{lesson?.explanation}</p>
          <p className="text-gray-500 text-md">{lesson?.more} </p>
          <div className='ml-[10rem] mb-[2rem]'>
            <h2 className="my-[2rem] text-start text-gray-300 font-bold text-lg">An example:</h2>
            <div className="bg-[#1C2526] mx-auto w-[90%] p-[1rem] bg-opacity-80 text-sm">
              <p className="text-gray-50">{lesson?.example}</p>
            </div>
          </div>
          <div className="grid grid-cols-12 gap-4 mx-auto w-[70%] text-start items-start mt-8">
            <h2 className="col-span-2 mt-2 text-gray-300 font-bold">Note:</h2>
            <div className="col-span-10 bg-[#1b1733] p-4">
              <p className="text-gray-500 text-sm">
                {lesson?.note}
              </p>
            </div>
          </div>

        </div>
      </div>

      <div className="mt-[10rem] ml-[5rem]">
        <h2 className='text-gray-300 text-start ml-[10rem] mb-2 font-bold'>Assignment:</h2>
        <div className='mx-[10rem]'>
          <p className="text-gray-400 text-start font-md">
            {lesson?.assignment}
          </p>
        </div>

      </div>

      <div className='mt-[6rem]'>
         <CodeEditor lessonId={lesson?.id} />
      </div>

      <Progress />

      <Footer />
    
    </div>
  )
}

export default Lesson
