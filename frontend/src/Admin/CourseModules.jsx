import React from 'react';
import { FloatingNav } from '../Components/ui/FloatingNav';
import BrainlyCodeIcon from '../Components/BrainlyCodeIcon';
import { Link, useParams } from 'react-router-dom';
import paint from '../assets/paint.png';
import time from '../assets/time.png';
import star from '../assets/star.png';
import Footer from './../Components/ui/Footer';
import { ModuleItem } from './../Components/ModuleItem';
import { useGetModulesForCourseQuery } from '../redux/api/moduleSlice';
import Header from './../Components/ui/Header';
import { useGetCourseByIdQuery } from '../redux/api/coursesSlice';
import { toast } from 'react-toastify';
import Loader from './../Components/ui/Loader';
import VideoItem from './../Components/VideoItem'; // import the new component
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

  const combinedItems = [
  ...(videos?.map(video => ({ ...video, type: 'video' })) || []),
  ...(modules?.map(module => ({ ...module, type: 'module' })) || []),
  ];

// Sort by the number field
  combinedItems.sort((a, b) => a.number - b.number);

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

        <div className='bg-[#0A1C2B] border-4 border-[#6B5EDD] w-full mx-auto p-6 rounded-xl flex flex-row  sm:flex-col justify-between items-center gap-6'>
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



        <div className='w-full mx-auto mt-10 space-y-4'>
          {combinedItems?.length > 0 ? combinedItems.map(item => {
            if (item.type === 'video') {
              return (
                <VideoItem
                  key={`video-${item.id}`}
                  moduleId={id}
                  id={item.id}
                  title={item.title}
                />
              );
            }

            if (item.type === 'module') {
              return (
                <ModuleItem
                  key={`module-${item.id}`}
                  title={item.title}
                  submodules={item.miniModules}
                  moduleId={item.id}
                />
              );
            }

            return null;
          }) : <h2 className='text-center mb-6'>No modules in this course!</h2>}
        </div>
        <div className="flex justify-center mt-6">
        <button
            onClick={() => console.log("Add a new module")}
            className="flex items-center gap-2 bg-[#1D1543] hover:bg-[#2C1E6A] text-white px-6 py-3 rounded-full"
        >
        </button>
        </div>


      </section>

      <Footer />
    </div>
  );
};

export default Modules;
