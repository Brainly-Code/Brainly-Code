import React, { useState } from 'react';
import SubModuleItem from './SubModuleItem';
import upArrow from '../assets/upArrow.png';
import downArrow from '../assets/downArrow.png';

const ModuleItem = ({ moduleId,title, submodules }) => {
  const [open, setOpen] = useState(false);

  console.log(submodules)

  return (
    <div className='bg-[#6B5EDD] rounded-xl p-3 sm:p-4 md:p-6'>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full text-left"
        >
        <div className="flex items-center space-x-2">
            <input type="radio" className='mr-3'/>
            <span className=" font-bold">{title}</span>
        </div>
        <span className="text-xl block w-4 h-4">
            {open ? <img src={upArrow} /> : <img src={downArrow} />}
        </span>
      </button>

      {open && Array.isArray(submodules) && submodules.length > 0 && (
        <>
        <div className='mt-2 sm:mt-3 space-y-2'>
          {submodules.map(( submodule ) => (
            <SubModuleItem key={submodule.id} title={submodule.title} id={submodule.id} moduleId={moduleId} steps={submodule.lessons} />
          ))}
        </div>
        <button
            onClick={() => console.log("Add a new module")}
            className="flex items-center gap-2 bg-[#1D1543] hover:bg-[#2C1E6A] text-white px-6 py-3 rounded-full h-1/2 mt-auto mb-auto"
        >
            Add module
        </button>
        </>
      )}
    </div>
  );
};

export { ModuleItem };
