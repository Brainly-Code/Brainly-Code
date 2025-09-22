import React from 'react';
import { FloatingNav } from './ui/FloatingNav';
import BrainlyCodeIcon from './BrainlyCodeIcon';
import { Link, useParams } from 'react-router-dom';
import paint from '../assets/paint.png';
import time from '../assets/time.png';
import star from '../assets/star.png';
import file from '../assets/file.png';
import Footer from './ui/Footer';
import { ModuleItem } from './ModuleItem';
import { useGetModulesForCourseQuery } from '../redux/api/moduleSlice';
import Header from './ui/Header';
import { useGetCourseByIdQuery } from '../redux/api/coursesSlice';
import { toast } from 'react-toastify';
import Loader from './ui/Loader';
import VideoItem from './VideoItem'; // import the new component
import { useGetVideosForCourseQuery } from '../redux/api/videoApi'; // hypothetical API slice
import { useGetResourcesForCourseQuery } from '../redux/api/resourcesSlice';

const Modules = () => {

  const { id } = useParams();

  const { data: course, error, isLoading } = useGetCourseByIdQuery(id);

  const { data: modules } = useGetModulesForCourseQuery(id);
  const { data: videos } = useGetVideosForCourseQuery(id);
  const { data: resources } = useGetResourcesForCourseQuery(id);


  const combinedItems = [
  ...(videos?.map(video => ({ ...video, type: 'video' })) || []),
  ...(modules?.map(module => ({ ...module, type: 'module' })) || []),
  ...(resources?.map(resource => ({ ...resource, type: 'file'})) || [])
  ];

const handleViewInBrowser = (url) => {
    // Ensure the URL points to your Cloudinary account
    const updatedUrl = url.replace(
        'https://res.cloudinary.com/dglbxzxsc/',
        'https://res.cloudinary.com/dnppwzg0k/'
    );

    const extension = updatedUrl.split('.').pop().toLowerCase();

    if (['docx', 'doc', 'pptx', 'ppt', 'xlsx'].includes(extension)) {
        // Open Office documents in Office Online Viewer
        const officeUrl = `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(updatedUrl)}`;
        window.open(officeUrl, '_blank');
    } else if (extension === 'pdf') {
        // Open PDF directly in the browser
        window.open(updatedUrl, '_blank');
    } else {
        // Fallback: open other file types in Google Docs Viewer
        const googleViewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(updatedUrl)}&embedded=true`;
        window.open(googleViewerUrl, '_blank');
    }
};




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
              <span>{course?.duration || 0} hours</span>
            </div>
            <div className='flex items-center gap-2'>
              <img src={star} alt="Star" className='w-5 h-5' />
              <span>{course?.likes || 0}</span>
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
                  moduleId={id}
                />
              );
            }

            if (item.type === 'file') {
              const openFile = () => {
              if (item.url) {
                handleViewInBrowser(item.url);
              } else {
                toast.error("File URL not available");
              }
            };


              return (
                <div
                  key={`file-${item.id}`}
                  onClick={openFile}
                  className="bg-[#6B5EDD] rounded-xl p-3 sm:p-4 md:p-6 cursor-pointer hover:bg-[#5a4dcf] transition"
                >
                  <div className="flex items-center justify-between w-full text-left">
                    <div className="flex items-center space-x-2">
                      <input type="radio" className="mr-3" />
                      <span className="font-bold">{item.title}</span>
                    </div>
                    <span className="text-xl block w-6 h-6">
                      <img src={file} alt="file icon" />
                    </span>
                  </div>
                </div>
              );
            }


            return null;
          }) : <h2 className='text-center mb-6'>No modules in this course!</h2>}
        </div>

      </section>

      <Footer />
    </div>
  );
};

export default Modules;
