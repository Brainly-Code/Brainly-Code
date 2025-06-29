import React, { useState } from 'react'
import { useUpdateUserMutation } from '../redux/api/userSlice';
import { toast } from 'react-toastify';

const UpdateUser = () => {
  const [image, setImage] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  // const { data: user } = useProfileMutation();
  
  const [ UpdateUser ]  = useUpdateUserMutation();

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];

    if(!file) {
      toast.error("No image provided")
      return 
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await UpdateUser({image: image, username: username, email: email});

      console.log("Upload Response:", res); // Debugging
      console.log("Image URL:", res.image); // Debugging
      
      if(!res.image){
         toast.error("Image upload failed");
      }

      toast.success(res.message);

      setImage(file);
      setImageUrl(res.image);
    } catch (error) {
      console.error("Upload Error:", error);
      toast.error(error?.data?.message || "Image upload failed")
    }
  }
 
  return (
    <div className='bg-[#250f47] h-screen'>
       <div className="h-70 mx-auto text-center font-bold py-5">Create Product</div>
            {imageUrl && (
              <div className="text-center h-[30%] w-[100%] m-0">
                <img src={imageUrl}  alt="product" className="my-0 rounded-lg mx-auto w-[100%] h-[100%]" />
              </div>
            )}

            <div className="mb-3 w-[70%] mx-auto">
              <label htmlFor='image' className="border my-0 text-white px-4 block w-full text-center rounded-lg cursor-pointer font-bold py-11">
                { image ? image.name : "Upload Image" }
              </label>
              <input 
              type="file" 
              id='image'
              name='image'
              accept='image/*'
              onChange={uploadFileHandler}
              className={!image ? "this din't work" : 
              "hidden"} />
            </div>

            <div className="m-5 mb-[4rem] ml-[16rem] text-gray-500">
              <input type="text" name='username' className='ml-[3rem] text-center w-[20rem]  bg-[#1d0d3a] p-2 text-md' placeholder="Enter username" onChange={e => setUsername(e.target.value)} />  
              <input type="email" name='email' className='ml-[3rem] text-center w-[20rem]  bg-[#1d0d3a] p-2 text-md' placeholder="Email" onChange={e => setEmail(e.target.value)} />
            </div>
            <button type='submit' className='mx-[37rem] px-5 py-2 rounded  bg-[#271476]'>Update</button>
    </div>
  )
}

export default UpdateUser
