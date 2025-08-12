import React, { useState } from 'react';
import SubModuleItem from './SubModuleItem';
import upArrow from '../assets/upArrow.png';
import downArrow from '../assets/downArrow.png';
import { toast } from 'react-toastify';
import { useCreateMiniModuleMutation, useGetMiniModulesPerModuleQuery } from '../redux/api/subModuleSlice';
import { Loader2 } from 'lucide-react';

const ModuleItem = ({ moduleId, title }) => {
  const [open, setOpen] = useState(false);
  const [showAddSubModuleForm, setShowAddSubModuleForm] = useState(false);
  const [newSubmoduleTitle, setNewSubmoduleTitle] = useState('');

  const [createMiniModule, { isLoading }] = useCreateMiniModuleMutation();
  const {
    data: submodules = [],
    isLoading: isSubmodulesLoading,
    refetch,
  } = useGetMiniModulesPerModuleQuery(moduleId);

  const handleSubModuleSubmit = async () => {
    if (!newSubmoduleTitle.trim()) {
      toast.error('Please enter a sub-module title');
      return;
    }

    try {
      await createMiniModule({ title: newSubmoduleTitle, courseModuleId: Number(moduleId) }).unwrap();
      toast.success('Sub-module added successfully!');
      setNewSubmoduleTitle('');
      setShowAddSubModuleForm(false);
      refetch();
    } catch (err) {
      toast.error('Failed to add sub-module. Please try again.');
      console.error('Failed to create sub-module:', err);
    }
  };
  
  if(isSubmodulesLoading) {
    return <Loader2 />
  }

  return (
    <div className="bg-[#6B5EDD] rounded-xl p-3 sm:p-4 md:p-6">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full text-left"
      >
        <div className="flex items-center space-x-2">
          <input type="radio" className="mr-3" />
          <span className="font-bold text-sm md:text-base text-white">{title}</span>
        </div>
        <span className="text-xl block w-4 h-4">
          {open ? <img src={upArrow} alt="Collapse" /> : <img src={downArrow} alt="Expand" />}
        </span>
      </button>

      {open && Array.isArray(submodules) && submodules.length > 0 && (
        <div className="mt-2 sm:mt-3 space-y-2">
          {submodules.map((submodule) => (
            <SubModuleItem
              key={submodule.id}
              title={submodule.title}
              id={submodule.id}
              moduleId={moduleId}
              steps={submodule.lessons}
            />
          ))}
        </div>
      )}

      <div>
        <button
          onClick={() => setShowAddSubModuleForm(true)}
          className="flex text-sm md:text-base items-center gap-2 bg-[#1D1543] hover:bg-[#2C1E6A] text-white px-6 py-3 rounded-full h-8 mt-5 mb-auto"
        >
          Add sub-module
        </button>
      </div>

      {showAddSubModuleForm && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-[#4a38f1] text-black p-8 rounded-xl shadow-xl w-[90%] max-w-md">
            <h3 className="text-2xl font-normal mb-4">Add sub-module</h3>
            <div className="mb-4">
              <label className="block font-normal mb-1">Title:</label>
              <input
                type="text"
                value={newSubmoduleTitle}
                onChange={(e) => setNewSubmoduleTitle(e.target.value)}
                className="w-full opacity-90 p-2 border rounded"
                disabled={isLoading}
              />
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowAddSubModuleForm(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleSubModuleSubmit}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? 'Adding...' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export { ModuleItem };
