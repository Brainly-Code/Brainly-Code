import React from 'react';
import { Link } from 'react-router-dom';
import videoImg from '../assets/video.png';

const VideoItem = ({ id,moduleId,title}) => {
  return (
      <Link to={`/admin/course/module/${moduleId}/video/${id}`} className='bg-[#6B5EDD] rounded-xl p-3 sm:p-4 md:p-6 mb-4 flex justify-between items-center hover:cursor-pointer' replace>
      <div className="flex items-center space-x-2">
        <input type="radio" className='mr-3' />
        <span className="font-bold">{title}</span>
      </div>
        <img src={videoImg} className='w-8 h-8'/>
      </Link>
  );
};

export default VideoItem;
