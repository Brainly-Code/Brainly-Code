import React from 'react'
import { toast } from 'react-toastify';
import { Logout } from '../redux/Features/authSlice';
import { useGetLessonByIdQuery } from '../redux/api/LessonSlice';
import Loader from '../Components/ui/Loader';
import { FloatingNav } from '../Components/ui/FloatingNav';
import BrainlyCodeIcon from '../Components/BrainlyCodeIcon';
import CodeEditor from '../Components/CodeEditor';
import Footer from '../Components/ui/Footer';
import Progress from '../Components/ui/Progress';
import { useParams } from 'react-router-dom';

const Lesson2 = () => {
  const { id } = useParams();

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
      </div> 

      <div className="text-center">
        <h1 className='text-3xl font-bold text-gray-200 m-[1rem]'>Basics of HTML</h1>
        <div className="bg-[#216FB8] bg-opacity-25  mx-[7rem] p-[3rem]">
          <h2 className="text-gray-300 mb-[1rem] font-bold text-lg">{lesson.id}. {lesson.title}</h2>
          <p className="text-gray-400 text-md">{lesson.explanation}</p>
          <p className="text-gray-500 text-md">{lesson.more} </p>
          <div className='ml-[10rem] mb-[2rem]'>
            <h2 className="my-[2rem] text-start text-gray-300 font-bold text-lg">An example:</h2>
            <div className="bg-[#1C2526] mx-auto w-[90%] p-[1rem] bg-opacity-80 text-sm">
              <p className="text-gray-50">{lesson.example}</p>
            </div>
          </div>
          <div className="grid grid-cols-12 gap-4 mx-auto w-[70%] text-start items-start mt-8">
            <h2 className="col-span-2 mt-2 text-gray-300 font-bold">Note:</h2>
            <div className="col-span-10 bg-[#1b1733] p-4">
              <p className="text-gray-500 text-sm">
                {lesson.note}
              </p>
            </div>
          </div>

        </div>
      </div>

      <div className="mt-[10rem] ml-[5rem]">
        <h2 className='text-gray-300 text-start ml-[10rem] mb-2 font-bold'>Assignment:</h2>
        <div className='mx-[10rem]'>
          <p className="text-gray-400 text-start font-md">
            {lesson.assignment}
          </p>
        </div>

      </div>

      <div className='mt-[6rem]'>
         <CodeEditor />
      </div>

      <Progress />

      <Footer />
    
    </div>
  )
}

export default Lesson2
