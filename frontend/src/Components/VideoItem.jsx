import React from 'react';
import { useNavigate } from 'react-router-dom';
import videoImg from '../assets/video.png';

const VideoItem = ({ id,title}) => {
  const navigate = useNavigate();
  return (
    <div className='bg-[#6B5EDD] rounded-xl p-3 sm:p-4 md:p-6 mb-4 flex justify-between items-center ' onClick={() => navigate(`/user/course/video/${id}`)}>
      <div className="flex items-center space-x-2">
        <input type="radio" className='mr-3' />
        <span className="font-bold">{title}</span>
      </div>
        <img src={videoImg} className='w-1/6 h-1/6'/>
    </div>
  );
};

export default VideoItem;
