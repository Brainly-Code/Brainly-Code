import React, { useState } from 'react';
import { FloatingNav } from '../Components/ui/FloatingNav';
import BrainlyCodeIcon from '../Components/BrainlyCodeIcon';
import { Link, useParams } from 'react-router-dom';
import paint from '../assets/paint.png';
import time from '../assets/time.png';
import star from '../assets/star.png';
import Footer from './../Components/ui/Footer';
import { ModuleItem } from './ModuleItem';
import { useCreateModuleMutation, useGetModulesForCourseQuery } from '../redux/api/moduleSlice';
import { useGetCourseByIdQuery } from '../redux/api/coursesSlice';
import { toast } from 'react-toastify';
import Loader from './../Components/ui/Loader';
import VideoItem from './AdminVideoItem';
import { useCreateVideoMutation, useGetVideosForCourseQuery } from '../redux/api/videoApi';

const Modules = () => {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [showAddModuleForm, setShowAddModuleForm] = useState(false);
  const [uploadType, setUploadType] = useState('module');
  const [videoTitle, setVideoTitle] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const { data: course, error: courseError, isLoading: isCourseLoading } = useGetCourseByIdQuery(id);
  const { data: modules } = useGetModulesForCourseQuery(id);
  const { data: videos } = useGetVideosForCourseQuery(id);


  const [createModule, 
    { isLoading: isCreatingModule, isError: isCreateModuleError }
  ] = useCreateModuleMutation();
  const [createVideo, 
    { isLoading: isCreatingVideo, isError: isCreateVideoError }
  ] = useCreateVideoMutation();

  const combinedItems = [
    ...(videos?.map(video => ({ ...video, type: 'video' })) || []),
    ...(modules?.map(module => ({ ...module, type: 'module' })) || []),
  ];

  combinedItems.sort((a, b) => a.number - b.number);

  const handleSubmit = async () => {
    if (uploadType === 'module') {
      try {
        await createModule({ title, courseId: Number(id) }).unwrap();
        setTitle('');

        toast.success('Module created successfully!');
      } catch (err) {
        console.error(err);
        toast.error(err?.data?.message || 'Error creating module');
      }
    } else if (uploadType === 'video') {
      try {
        const formData = new FormData();
        formData.append('title', videoTitle);
        formData.append("courseId", id); 
        formData.append('file', videoFile);

        await createVideo(formData).unwrap(); // Connect this to your RTK mutation
        setVideoTitle('');
        setVideoFile(null);
        toast.success('Video uploaded successfully!');
      } catch (err) {
        console.error(err);
        toast.error(err?.data?.message || 'Error uploading video');
      }
    }

    setShowAddModuleForm(false);
  };

  if (courseError) {
    toast.error(courseError?.data?.message || 'Error fetching course');
  }

  if (isCourseLoading) {
    return <Loader />;
  }

  return (
    <div className='bg-[#0D0056] min-h-screen text-white flex flex-col justify-between'>
      <h3 className='text-2xl font-bold mt-12 text-center'>{course?.title}</h3>

      <section className='bg-[#0A1C2B] mt-12 w-1/2 mx-auto rounded-3xl border-8 border-[rgba(33,111,184,0.5)]'>
        <div className='bg-[#0A1C2B] border-4 border-[#6B5EDD] w-full mx-auto p-6 rounded-xl flex flex-row sm:flex-col justify-between items-center gap-6'>
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
              <span>{course?.rating || 0 }</span>
            </div>
          </div>
        </div>

        <div className='w-full mx-auto mt-10'>
          <h5 className='text-xl font-semibold mb-4 text-center'>Modules</h5>
        </div>

        <div className='w-full mx-auto mt-10 space-y-4'>
          {combinedItems.length > 0 ? (
            combinedItems.map(item => {
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
            })
          ) : (
            <h2 className='text-center mb-6'>No modules in this course!</h2>
          )}
        </div>

        <div className="flex justify-center mt-6 bg-[#6B5EDD] w-full h-12 rounded-xl">
          <button
            onClick={() => setShowAddModuleForm(true)}
            className="flex items-center gap-2 bg-[#1D1543] hover:bg-[#2C1E6A] text-white px-6 py-3 rounded-full h-1/2 mt-auto mb-auto"
          >
            Add module
          </button>
        </div>
      </section>

      {/* ADD MODULE MODAL */}
      {showAddModuleForm && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white text-black p-8 rounded-xl shadow-xl w-[90%] max-w-md">
            <h3 className="text-2xl font-semibold mb-4">Add Content</h3>

            {/* Radio button selector */}
            <div className="mb-4">
              <label className="mr-4">
                <input
                  type="radio"
                  name="contentType"
                  value="module"
                  checked={uploadType === 'module'}
                  onChange={() => setUploadType('module')}
                  className="mr-2"
                />
                Module
              </label>
              <label>
                <input
                  type="radio"
                  name="contentType"
                  value="video"
                  checked={uploadType === 'video'}
                  onChange={() => setUploadType('video')}
                  className="mr-2"
                />
                Video
              </label>
            </div>

            {/* Module input */}
            {uploadType === 'module' && (
              <div className="mb-4">
                <label className="block font-medium mb-1">Module Title:</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
            )}

            {/* Video input */}
            {uploadType === 'video' && (
              <>
                <div className="mb-4">
                  <label className="block font-medium mb-1">Video Title:</label>
                  <input
                    type="text"
                    value={videoTitle}
                    onChange={(e) => setVideoTitle(e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div className="mb-4">
                  <label className="block font-medium mb-1">Upload Video:</label>
                  <input
                    type="file"
                    onChange={(e) => setVideoFile(e.target.files[0])}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </>
            )}

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowAddModuleForm(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={handleSubmit}
              >{isCreatingModule || isCreatingVideo ? 'Adding...' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Placeholder: Submodule and Lesson modals logic here (optional) */}
    </div>
  );
};

export default Modules;
