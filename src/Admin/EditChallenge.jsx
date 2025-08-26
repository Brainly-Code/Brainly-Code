import React, { useState } from 'react';
import time from '../assets/time.png';
import star from '../assets/star.png';
import Footer from '../Components/ui/Footer';
import Edit from '../assets/edit.png'
import Delete from '../assets/bin.png'
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useGetChallengeByIdQuery, useGetChallengeInstructionsQuery, useCreateChallengeInstructionMutation, useUpdateChallengeInstructionMutation, useDeleteChallengeInstructionMutation, useUpdateChallengeMutation } from '../redux/api/challengeSlice.jsx';
import { Loader } from 'lucide-react';

const EditChallenge = () => {   
  const { id } = useParams();
  const [showAddModuleForm, setShowAddModuleForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showEditChallengeForm, setShowEditChallengeForm] = useState(false);
  const [editingInstruction, setEditingInstruction] = useState(null);
  const [newInstruction, setNewInstruction] = useState('');
  const [editingField, setEditingField] = useState('');
  const [editValue, setEditValue] = useState('');

  const { data: challenge, refetch: refetchChallenge } = useGetChallengeByIdQuery(id);
  const { data: instructions = [], refetch } = useGetChallengeInstructionsQuery(id);
  const [createInstruction, { isLoading: isCreating }] = useCreateChallengeInstructionMutation();
  const [updateInstruction, { isLoading: isUpdating }] = useUpdateChallengeInstructionMutation();
  const [deleteInstruction, { isLoading: isDeleting }] = useDeleteChallengeInstructionMutation();
  const [updateChallenge, { isLoading: isUpdatingChallenge }] = useUpdateChallengeMutation();

  const handleSubmit = async () => {
    if (!newInstruction.trim()) {
      toast.error('Instruction cannot be empty');
      return;
    }
    try {
      await createInstruction({
        challengeId: Number(id),
        number: (instructions?.length || 0) + 1,
        instruction: newInstruction.trim(),
      }).unwrap();
      toast.success('Instruction added');
      setNewInstruction('');
      setShowAddModuleForm(false);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || 'Error creating instruction');
    }
  };

  const handleEdit = (instruction) => {
    setEditingInstruction(instruction);
    setNewInstruction(instruction.instruction);
    setShowEditForm(true);
  };

  const handleUpdate = async () => {
    if (!newInstruction.trim()) {
      toast.error('Instruction cannot be empty');
      return;
    }
    try {
      await updateInstruction({
        id: editingInstruction.id,
        data: {
          instruction: newInstruction.trim(),
        }
      }).unwrap();
      toast.success('Instruction updated');
      setNewInstruction('');
      setShowEditForm(false);
      setEditingInstruction(null);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to update instruction');
    }
  };

  const handleDelete = async (instructionId) => {
    if (window.confirm('Are you sure you want to delete this instruction?')) {
      try {
        await deleteInstruction(instructionId).unwrap();
        toast.success('Instruction deleted');
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || 'Failed to delete instruction');
      }
    }
  };

  const handleEditChallenge = (field) => {
    setEditingField(field);
    setEditValue(challenge?.[field] || '');
    setShowEditChallengeForm(true);
  };

  const handleUpdateChallenge = async () => {
    if (!editValue.trim()) {
      toast.error(`${editingField} cannot be empty`);
      return;
    }
    try {
      await updateChallenge({
        id: Number(id),
        data: {
          [editingField]: editValue.trim(),
        }
      }).unwrap();
      toast.success(`${editingField} updated successfully`);
      setEditValue('');
      setShowEditChallengeForm(false);
      setEditingField('');
      refetchChallenge();
    } catch (err) {
      toast.error(err?.data?.message || `Failed to update ${editingField}`);
    }
  };

  if(isDeleting) {
    return <Loader />
  }

  return (
    <div className='bg-[#0D0056] min-h-screen text-white flex flex-col justify-between'>
      <div className="flex mt-12 gap-[30%]">
        <Link to="/admin/challenges">
          <button className="px-8 py-3 rounded-lg bg-blue-500">Back</button>
        </Link>
        <h3 className='text-2xl font-bold text-center'>Edit challenge</h3>
        <Link to={`/admin/completers/${id}`}>
          <button className="px-8 py-3 rounded-lg bg-blue-500">Check out completers</button>
        </Link>
      </div>

      <section className='bg-[#0A1C2B] mt-12 w-1/2 mx-auto rounded-3xl border-8 border-[rgba(33,111,184,0.5)]'>
        <div className='bg-[#0A1C2B] border-4 border-[#6B5EDD] w-full mx-auto p-6 rounded-xl flex flex-row sm:flex-col justify-between items-center gap-6'>
          <div className='flex flex-col items-center gap-3'>
            <div className='flex flex-row items-center gap-6'>
              <h2 className='text-2xl font-bold'>{challenge?.title || 'Challenge title'}</h2>
              <img 
                src={Edit} 
                alt="Edit" 
                className='w-5 h-5 cursor-pointer' 
                onClick={() => handleEditChallenge('title')}
              />
            </div>
            <div className='flex flex-row items-center gap-6'>
              <span>{challenge?.description || 'Challenge description...'}</span>
              <img 
                src={Edit} 
                alt="Edit" 
                className='w-5 h-5 cursor-pointer' 
                onClick={() => handleEditChallenge('description')}
              />
            </div>
          </div>
          <div className='flex flex-col sm:flex-row gap-5'>
            <div className='flex items-center gap-2'>
              <img src={time} alt="Time" className='w-5 h-5' />
              <span>{challenge?.estimatedTime || 0} hours</span>
            </div>
            <div className='flex items-center gap-2'>
              <img src={star} alt="Star" className='w-5 h-5' />
              <span>{challenge?.rating || 0}</span>
            </div>
          </div>
        </div>

        <div className='w-full mx-auto mt-10'>
          <h5 className='text-xl font-semibold mb-4 text-center'>Instructions</h5>
        </div>

        <div className='w-full mx-auto mt-10 space-y-4'>
          {Array.isArray(instructions) && instructions.length > 0 ? (
            instructions
              .slice()
              .sort((a, b) => (a.number || 0) - (b.number || 0))
              .map((inst) => (
                <div key={inst.id} className='bg-[#6B5EDD] rounded-xl p-3 sm:p-4 md:p-6'>
                  <div className='space-y-2 text-sm opacity-90 flex flex-row justify-between items-center'>
                    <div className='font-bold'>{inst.number}. {inst.instruction}</div>
                    <div className='flex gap-2'>
                      <img 
                        src={Edit} 
                        alt="Edit" 
                        className='w-5 h-5 cursor-pointer' 
                        onClick={() => handleEdit(inst)}
                      />
                      <img 
                        src={Delete} 
                        alt="Delete" 
                        className='w-5 h-5 cursor-pointer' 
                        onClick={() => handleDelete(inst.id)}
                      />
                    </div>
                  </div>
                </div>
              ))
          ) : (
            <div className='text-center opacity-80'>No instructions yet.</div>
          )}
        </div>

        <button
          onClick={() => setShowAddModuleForm(true)}
          className="flex items-center gap-6 bg-[#6B5EDD] hover:bg-[#2C1E6A] text-white px-8 py-1 rounded-md h-1/2 mb-auto mx-auto mt-5 font-bold"
        >
          Add
        </button>
   
      </section>

      {/* Add Instruction Modal */}
      {showAddModuleForm && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-[#4a38f1] text-black p-8 rounded-xl shadow-xl w-[90%] max-w-md">
            <h3 className="text-2xl font-semibold mb-4">Add Content</h3>

            <div className="mb-4">
              <label className="block font-medium mb-1">Instruction:</label>
              <textarea
                value={newInstruction}
                onChange={(e) => setNewInstruction(e.target.value)}
                className="w-full p-2 border rounded"
                rows={3}
                placeholder="Type the instruction here..."
              />
            </div>

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
                disabled={isCreating}
              >
                {isCreating ? 'Adding...' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Instruction Modal */}
      {showEditForm && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-[#4a38f1] text-black p-8 rounded-xl shadow-xl w-[90%] max-w-md">
            <h3 className="text-2xl font-semibold mb-4">Edit Instruction</h3>

            <div className="mb-4">
              <label className="block font-medium mb-1">Instruction:</label>
              <textarea
                value={newInstruction}
                onChange={(e) => setNewInstruction(e.target.value)}
                className="w-full p-2 border rounded"
                rows={3}
                placeholder="Type the instruction here..."
              />
            </div>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  setShowEditForm(false);
                  setEditingInstruction(null);
                  setNewInstruction('');
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={handleUpdate}
                disabled={isUpdating}
              >
                {isUpdating ? 'Updating...' : 'Update'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Challenge Modal */}
      {showEditChallengeForm && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-[#4a38f1] text-black p-8 rounded-xl shadow-xl w-[90%] max-w-md">
            <h3 className="text-2xl font-semibold mb-4">Edit {editingField}</h3>

            <div className="mb-4">
              <label className="block font-medium mb-1">{editingField.charAt(0).toUpperCase() + editingField.slice(1)}:</label>
              {editingField === 'description' ? (
                <textarea
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="w-full p-2 border rounded"
                  rows={3}
                  placeholder={`Enter ${editingField}...`}
                />
              ) : (
                <input
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder={`Enter ${editingField}...`}
                />
              )}
            </div>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  setShowEditChallengeForm(false);
                  setEditingField('');
                  setEditValue('');
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={handleUpdateChallenge}
                disabled={isUpdatingChallenge}
              >
                {isUpdatingChallenge ? 'Updating...' : 'Update'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default EditChallenge;


