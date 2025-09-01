import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useCreateCourseMutation } from '../redux/api/AdminSlice';
import { toast } from 'react-toastify';
import Loader from '../Components/ui/Loader';

const CreateCourse = () => {
  const [ title, setTitle ] = useState();
  const [ category, setCategory ] = useState();
  const [ level, setLevel ] = useState('');
  const [ duration, setDuration ] = useState(0);
  const [ description, setDescription ] = useState('');

  const navigate = useNavigate();

  const [ createCourse , {isLoading} ] = useCreateCourseMutation();
  
  // const search = useLocation();
  // const sp = new URLSearchParams(search);
  // const redirect = sp.get('/') || '/';

  if(isLoading){
    return <Loader/>
  }

  const submitHandler = async (e) => {
    e.preventDefault();
    
    try {
      console.log("HERE")
      const res = await createCourse({ title, category, level, description }).unwrap(); 
      console.log(res)
      navigate('/admin/myCourses')
      toast.success("Course created successfully")
    } catch (error) {
      console.log(error)
      toast.error(error?.data?.message)
    }
  }

  return (
    <div className='h-screen bg-[#300DF5]' >
      <div className="m-auto p-[1rem] w-[40%]">
        <form action="" onSubmit={submitHandler}>
          <div className='block mt-[3rem] mb-[2rem]'>
            <label htmlFor="title" className='text-gray-200 mr-7 '>Title :</label>
            <input type="text" id="title" name='title' placeholder='Title' onChange={e => setTitle(e.target.value)} className='p-3 border-b-2 w-[70.6%] rounded opacity-40 border-blue-300' />
          </div>
          <div className='block mb-[2rem]'>
            <label htmlFor="category" className='text-gray-200 mr-7 '>Category :</label>
            <select type="text" id="category" name='category' placeholder='Category' onChange={e => setCategory(e.target.value)} className='p-3 border-b-2 w-[64.5%] rounded opacity-40 border-blue-300'> 
              <option value=""></option>
              <option className='opacity-40' value="Normal">Normal</option>
              <option className='opacity-40' value="Medium">Medium</option>
              <option className='opacity-40' value="Hard">Hard</option>
            </select>
          </div>
          <div className='block mb-[2rem]'>
            <label htmlFor="level" className='text-gray-200 mr-7 '>Level :</label>
            <select type="text" id="level" placeholder='Level' onChange={e => setLevel(e.target.value)} className='p-3 border-b-2 w-[70%] rounded opacity-40 border-blue-300' >
            <option value=""></option>
            <option className='opacity-40' name="level" value="BEGINNER">Beginner</option>
            <option className='opacity-40' name="level" value="INTERMEDIATE">Intermediate</option>
            <option className='opacity-40' name="level" value="ADVANCED">Advanced</option>
            </select>
          </div>
          <div className='block mb-[2rem]'>
            <label htmlFor="duration" className='text-gray-200 mr-7 '>Duration :</label>
            <input type="number" id="duration" name='duration' placeholder='Duration in weeks' onChange={e => setDuration(Number(e.target.value))} className='p-3 border-b-2 w-[65%] rounded opacity-40 border-blue-300' />
          </div>
          <div className='block mb-[2rem]'>
            <label htmlFor="description" className='text-gray-200 mr-7 '>Description :</label>
            <textarea id="description" name='description' placeholder='Description about this course' maxLength={160} onChange={e => setDescription(e.target.value)} className='p-3 border-b-2 w-[65%] rounded opacity-40 border-blue-300'></textarea>
          </div>
          <button disabled={isLoading} type='submit' className="ml-[8rem] mt-2 px-8 rounded hover:bg-gradient-to-l hover:from-blue-700 hover:to-blue-500 bg-gradient-to-r from-[#366665] to-[#18caca] py-2">{isLoading ? "Creating course": "Create Course"} </button>        </form>
      </div>
    </div>
  )
}

export default CreateCourse
