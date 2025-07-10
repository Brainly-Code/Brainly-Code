import React from 'react';
import { FloatingNav } from './ui/FloatingNav';
import BrainlyCodeIcon from './BrainlyCodeIcon';
import { Link, useParams } from 'react-router-dom';
import paint from '../assets/paint.png';
import time from '../assets/time.png';
import star from '../assets/star.png';
import Footer from './ui/Footer';
import { ModuleItem } from './ModuleItem';
import { useGetModulesForCourseQuery } from '../redux/api/moduleSlice';
import Header from './ui/Header';
import { useGetCourseByIdQuery } from '../redux/api/coursesSlice';
import { toast } from 'react-toastify';
import Loader from './ui/Loader';
import VideoItem from './VideoItem'; // import the new component
import { useGetVideosForCourseQuery } from '../redux/api/videoApi'; // hypothetical API slice

const Modules = () => {
  // const [openSections, setOpenSections] = useState({
  //   intro: false,
  //   basic: true,
  //   intermediate: false,
  //   advanced: false,
  // });

  // const toggleSection = (section) => {
  //   setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  // };
  const { id } = useParams();

  const { data: course, error, isLoading } = useGetCourseByIdQuery(id);

  const { data: modules } = useGetModulesForCourseQuery(id);
  const { data: videos } = useGetVideosForCourseQuery(id);

  if(error) {
    toast.error(error?.data?.message);
  }

  if(isLoading) {
    return <Loader />
  }
  
  return (
    <div className='bg-[#0D0056] h-full text-white flex flex-col justify-between'>
      <Header />

      {/* Course Header */}
      <h3 className='text-2xl font-bold  mt-12 text-center'>{course?.title}</h3>

      <section className='bg-[#0A1C2B] mt-12 w-1/2 mx-auto rounded-3xl border-8 border-[rgba(33,111,184,0.5)]'>

        <div className='bg-[#0A1C2B] border-4 border-[#6B5EDD] w-full mx-auto p-6 rounded-xl border border-gray-400 flex flex-row flex-col sm:flex-col justify-between items-center gap-6'>
          <div className='flex flex-col items-center gap-3'>
            <img src={paint} alt="Paint" className='w-6 h-6' />
            <span>{course?.description}</span>
          </div>
          <div className='flex flex-col sm:flex-row gap-5'>
            <div className='flex items-center gap-2'>
              <img src={time} alt="Time" className='w-5 h-5' />
              <span>{course?.duration} hours</span>
            </div>
            <div className='flex items-center gap-2'>
              <img src={star} alt="Star" className='w-5 h-5' />
              <span>{course?.rating}</span>
            </div>
          </div>
        </div>

          <div className='w-full mx-auto mt-10'>
          <h5 className='text-xl font-semibold mb-4 text-center'>Modules</h5>
          </div>



        {/* Modules */}
       <div className='w-full mx-auto mt-10 space-y-4'>

         {/* Videos Section */}
        {videos && videos.length > 0 && (
          <>
            <div className='w-full mx-auto'>
              {videos.map(video => (
                <VideoItem key={video.id} moduleId={id} id={video.id} title={video.title} />
              ))}
            </div>
          </>
        )}
        
  {/* Example Module */}
  <div className='w-full mx-auto mt-10 space-y-4'>
  {modules?.map((module) => { // <-- Check if miniModules exists
    return (
      <ModuleItem
        key={module.id}
        title={module.title}
        submodules={module.miniModules} // Could be undefined here
      />
    );
})}

</div>


</div>

      </section>

      <Footer />
    </div>
  );
};

export default Modules;
