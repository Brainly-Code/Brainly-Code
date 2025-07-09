import React, { useState } from 'react';
import upArrow from '../assets/upArrow.png';
import downArrow from '../assets/downArrow.png';
import { Link } from 'react-router-dom';
import { useGetLessonsForSubModuleQuery } from '../redux/api/LessonSlice';

const SubModuleItem = ({ title, steps }) => {
  const [open, setOpen] = useState(false);

  const {data: lessons} = useGetLessonsForSubModuleQuery(2);
  console.log(steps);
  
  return (
    <div className="bg-[#1E20B7] rounded-lg w-full max-w-4xl mx-auto p-4 sm:p-5">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full text-left"
      >
        <div className="flex items-center space-x-2">
            <input
                type="checkbox"
                className="appearance-none w-4 h-4 mr-3 border-2 border-white rounded-sm checked:bg-[#6B5EDD] checked:border-[#6B5EDD] focus:outline-none"
            />
          <span className="font-bold text-sm sm:text-base">{title}</span>
        </div>
        <span className="text-xl block w-3 h-3">
          {open ? <img src={upArrow} alt="Up arrow" /> : <img src={downArrow} alt="Down arrow" />}
        </span>
      </button>

      {open && lessons && lessons.length > 0 && (
        <div className="mt-3 bg-[#1E20B7] p-3 sm:p-4 rounded-lg">
          {/* Responsive grid: changes number of columns based on screen size */}
          <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-12 lg:grid-cols-15 gap-2 mb-4">
            {lessons?.map((lesson, i) => (
                <Link 
                  key={lesson.id}
                  to={`/user/lesson/${lesson.id}`}
                  className='bg-white font-bold text-[#6B5EDD] text-center rounded text-xs sm:text-sm py-1'  
                >
                  {i + 1}
                </Link>
            ))}
          </div>
          <div className="flex justify-end w-full">
            <Link to={`/user/lesson/${1}`}>
              <button className="bg-[#6B5EDD] hover:bg-[#4d3eb0] text-sm py-1 px-6 sm:px-10 mt-5 rounded-lg border">
                Start
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubModuleItem;
