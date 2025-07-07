import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "react-toastify"
import { Link } from "react-router-dom"
import { useProfileMutation } from "../redux/api/userSlice"
import { setCredentials } from "../redux/Features/authSlice"
import { jwtDecode } from "jwt-decode"
import user from '../assets/user.png'

const Profile = () => {
  const [username, setUserName]=useState('')
  const [email, setEmail]=useState('')
  const [password, setPassword]=useState("")
  const [confirmPassword, setConfirmPassword]=useState("")
   
  const {userInfo}=useSelector(state=>state.auth)
  const token = jwtDecode(userInfo.access_token);
  const [updateProfile, {isLoading: loadingUpdateProfile}]= useProfileMutation()
 
  useEffect(()=>{
    setUserName(token.username)
    setEmail(token.email)
},[token.email,  token.username])

  const dispatch = useDispatch()

  const submitHandler = async (e)=>{
    e.preventDefault()

    if(userInfo.password !== userInfo.confirmPassword){
      toast.error("Passwords do not match")
    }else{
      try {
        const res = await updateProfile({_id: token.sub, username, email, password}).unwrap()
        dispatch(setCredentials({...res}))
        toast.success("User profile updated successfully")
      } catch (error) {
        toast.error(error?.data?.message || error.message)
      }
    }
  }

  return (
    <div className=" h-full w-full bg-[#110167] p-4">
      <div className="flex justify-center align-center md:flex md:space-x-4">
        <div className="md:w-1/3">
          <h1 className="text-xl font-bold mb-7 text-[#989898] text-center">Update Profile</h1>
          <form onSubmit={submitHandler}>
            <div className="w-48 h-48 bg-white rounded-full mx-auto flex items-center">
              <img src={user} className="w-5/6 m-auto"/>
            </div>
            <div className="mb-4">
              <label className="block text-[rgba(255,255,255,0.7)] font-bold mb-2">Name:</label>
              <input type="text" className="form-input p-2 bg-[rgba(217,217,217,0.2)] rounded-md w-full text-[rgba(255,255,255,0.7)]" value={username}  placeholder="Enter name" onChange={e=>setUserName(e.target.value)} />
            </div>
            <div className="mb-4">
              <label className="block text-[rgba(255,255,255,0.7)] font-bold mb-2">Email:</label>
              <input type="email" className="form-input p-2 bg-[rgba(217,217,217,0.2)] rounded-md w-full text-[rgba(255,255,255,0.7)]" value={email}  placeholder="Enter email" onChange={e=>setEmail(e.target.value)} />
            </div>
            <div className="mb-4">
              <label className="block text-[rgba(255,255,255,0.7)] font-bold mb-2">Change password:</label>
              <input type="password" className="form-input p-2 bg-[rgba(217,217,217,0.2)] rounded-md w-full text-[rgba(255,255,255,0.7)]" value={password}  placeholder="Enter new password" onChange={e=>setPassword(e.target.value)} />
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