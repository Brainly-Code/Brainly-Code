import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetLessonVideoByIdQuery } from '../redux/api/lessonVideoApi'; // You need this API slice for lesson videos
import { toast } from 'react-toastify';


const VideoPlayer2 = () => {
  const { moduleId, lessonVideoId } = useParams();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  // Replace with your actual RTK query for lesson videos
  const { data: lessonVideo, error, isLoading } = useGetLessonVideoByIdQuery(lessonVideoId);

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message || 'Error loading video');
    }
  }, [error]);

  const handleTimeUpdate = (e) => {
    const currentTime = e.target.currentTime;
    const duration = e.target.duration;
    const percent = duration ? Math.round((currentTime / duration) * 100) : 0;
    setProgress(percent);
  };

  if (error) return null; // toast will show error message already

  return (
    <div className="bg-[#070045] w-full min-h-screen flex flex-col">

      <section className="flex flex-col gap-10 w-full flex-grow">
        <h2 className="text-white mt-10 text-center text-sm md:text-lg font-bold">
          {lessonVideo?.title || 'Video'}
        </h2>
        <div className="w-3/4 h-96 bg-[#216FB8] mx-auto flex justify-center items-center rounded-lg overflow-hidden">
          <video
            className="w-full h-full object-cover"
            controls
            src={lessonVideo?.url}
            onTimeUpdate={handleTimeUpdate}
          >
            Your browser does not support the video tag.
          </video>
        </div>

        <div className="mx-auto flex flex-col gap-2 bg-[#0A1C2B] py-6 px-40 rounded-2xl">
          <span className="text-white">You are {progress}% there!</span>
          <button
            className="bg-[#6B5EDD] hover:bg-[#4d3eb0] text-sm py-1 px-6 sm:px-10 mt-5 rounded-lg border"
            onClick={() => navigate(`/admin/courseModules/${moduleId}`)}
          >
            Continue
          </button>
        </div>
      </section>

    </div>
  );
};

export default VideoPlayer2;
