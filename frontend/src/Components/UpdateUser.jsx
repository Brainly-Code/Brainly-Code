import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { useGetUserByIdQuery, useProfileMutation } from "../redux/api/userSlice";
import { setCredentials } from "../redux/Features/authSlice";
import { jwtDecode } from "jwt-decode";
import Loader from "./ui/Loader";
import profile from "../assets/profile.png";

const Profile = () => { 
  const {userInfo}=useSelector(state=>state.auth);
  const token = jwtDecode(userInfo.access_token);

  const { data: user } = useGetUserByIdQuery(token.sub);

  const [username, setUsername]=useState('');
  const [email, setEmail]=useState('');
  const [hash, setHash]=useState("");
  const [confirmPassword, setConfirmPassword]=useState("");
  const [image, setImage]=useState();
   
  const [updateProfile, {isLoading: loadingUpdateProfile}]= useProfileMutation();

  const dispatch = useDispatch();

  useEffect(()=> {
    setImage(user?.image);
    setUsername(user?.username);
    setEmail(user?.email)
  }, [user]);

  const submitHandler = async (e)=>{
    e.preventDefault();

    if(hash !== confirmPassword){
      toast.error("Passwords do not match");
    }else{
      try {

        if(!image){
          toast.error("No image uploaded");
        }

        const formData = new FormData();
        formData.append("username", username);
        formData.append("email", email);
        formData.append("hash", hash);

        if(image instanceof File){
          const res = await updateProfile({id: token.sub, formData, image}).unwrap();
          dispatch(setCredentials({...res}));
        }
        toast.success("User profile updated successfully");
      } catch (error) {
        toast.error(error?.data?.message || error.message);
      }
    }
  }


  return (
    <div className=" h-full w-full bg-[#110167] p-4">
      <div className="flex justify-center align-center md:flex md:space-x-4">
        <div className="md:w-1/3">
          <h1 className="text-xl font-bold mb-7 text-[#989898] text-center">Update Profile</h1>
          <form onSubmit={submitHandler}>
            
            <div className="w-48 h-48 overflow-hidden hover:cursor-pointer hover:bg-gray-400 bg-white rounded-full mx-auto flex items-center">

            {user?.image ? (
              <div>
                <img src={`../../src/assets/Greenland2.jpg`} alt="" className="w-[200px] hover:opacity-90 mx-auto h-[200px]" />
              </div>
            ) : (
              <div>
              <label htmlFor="image">
                {image instanceof File ? image.name : (
                  <img src={profile} alt="profile-image" className="w-[100px] mx-[2.7rem] hover:cursor-pointer"/>
                )}
              </label>
              <input
                type="file"
                className="hidden"
                id="image"
                accept="image/*"
                name="image"
                onChange={e=>setImage(e.target.files[0])}
              />
            </div>
            )}
            
              
            </div>
            <div className="mb-4">
              <label className="block text-[rgba(255,255,255,0.7)] font-bold mb-2">Name:</label>
              <input type="text" className="form-input p-2 bg-[rgba(217,217,217,0.2)] rounded-md w-full text-[rgba(255,255,255,0.7)]" value={user?.username}  placeholder="Enter New Name" onChange={e=>setUsername(e.target.value)} />
            </div>
            <div className="mb-4">
              <label className="block text-[rgba(255,255,255,0.7)] font-bold mb-2">Email:</label>
              <input type="email" className="form-input p-2 bg-[rgba(217,217,217,0.2)] rounded-md w-full text-[rgba(255,255,255,0.7)]" value={user?.email}  placeholder="Enter email" onChange={e=>setEmail(e.target.value)} />
            </div>
            <div className="mb-4">
              <label className="block text-[rgba(255,255,255,0.7)] font-bold mb-2">Change password:</label>
              <input type="password" className="form-input p-2 bg-[rgba(217,217,217,0.2)] rounded-md w-full text-[rgba(255,255,255,0.7)]" value={hash}  placeholder="Enter new password" onChange={e=>setHash(e.target.value)} />
            </div>
            <div className="mb-4">
              <label className="block text-[rgba(255,255,255,0.7)] font-bold mb-2">Confirm new password:</label>
              <input type="password" className="form-input p-2 bg-[rgba(217,217,217,0.2)] rounded-md w-full text-[rgba(255,255,255,0.7)]" value={confirmPassword}  placeholder="Confirm password" onChange={e=>setConfirmPassword(e.target.value)} />
            </div>
            <div className="flex justify-between">
              <button type="submit" className="bg-[#1ADBE2] text-white py-2 px-4 rounded-md hover:bg-pink-600 mx-auto">Update new user</button>
            </div>
          </form>
        </div>
        {loadingUpdateProfile && <Loader />}
      </div>
    </div>
  )
}

export default Profile