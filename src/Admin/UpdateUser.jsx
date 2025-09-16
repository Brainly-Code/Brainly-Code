import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useGetCurrentUserQuery, useGetProfileImageQuery, useUpdateProfileImageMutation, useUpdateUserMutation } from "../redux/api/userSlice";
import { setCredentials } from "../redux/Features/authSlice";
import Loader from "./ui/Loader";
import profileFallback from "../assets/profile.png";

const Profile = () => {
  const dispatch = useDispatch();
  const { access_token, user: currentUser } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const { data: user } = useGetCurrentUserQuery(currentUser?.id);
  const { data: image, isLoading: loadingImage } = useGetProfileImageQuery(currentUser?.id);
  const [updateProfile, { isLoading: loadingUpdateProfile }] = useUpdateUserMutation();
  const [uploadProfileImage, { isLoading: uploading }] = useUpdateProfileImageMutation();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [imageFile, setImageFile] = useState(null);

  

  useEffect(() => {
    setUsername(user?.username || '');
    setEmail(user?.email || '');
  }, [user]);


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    toast.success("Image added successfully");
  };

  const handleBack = () => {
  if (user?.role === "ADMIN" || user?.role === "SUPERADMIN") {
    navigate("/admin"); // admin dashboard route
  } else {
    navigate("/user"); // user dashboard route
  }
  };

 const submitHandler = async (e) => {
  e.preventDefault();

  if (password !== confirmPassword) {
    toast.error("Passwords do not match");
    return;
  }

  try {
    let cloudinaryUrl;

  
    if (imageFile) {
      console.log(imageFile)
      const cloudRes = await uploadProfileImage({ id: currentUser?.id, imageFile }).unwrap();
      
      console.log(cloudRes)
      cloudinaryUrl = cloudRes?.url || cloudRes?.secure_url;
    }


    const profileData = new FormData();
    profileData.append("username", username);
    profileData.append("email", email);
    profileData.append("password", password);


    if (cloudinaryUrl) {
      profileData.append("image", cloudinaryUrl);
    }


    const res = await updateProfile({ id: currentUser?.id, formData: profileData }).unwrap();

    
    dispatch(setCredentials({
      ...res,
      access_token: access_token,
    }));
  
    toast.success("Profile updated successfully");
  } catch (err) {
    toast.error(err?.data?.message || err.message);
  }
};
    const imagePath =
      image?.path && image.path.startsWith("http")
        ? image.path
        : profileFallback;



  return (
    <div className="min-h-screen w-full bg-[#110167] p-4">
                <button
            onClick={handleBack}
            className="py-2 px-4 rounded-md bg-[rgba(217,217,217,0.2)] text-white hover:bg-gray-700 font-bold"
          >
            Back
          </button>
      <div className="flex justify-center md:space-x-4">
        <div className="md:w-1/3">
          <h1 className="text-xl font-bold mb-7 text-[#989898] text-center">Update Profile</h1>
          <div className="mb-4">

        </div>

          <form onSubmit={submitHandler}>
            <div className="w-48 h-48 overflow-hidden hover:cursor-pointer bg-white rounded-full mx-auto flex items-center justify-center">
              <label htmlFor="image" className="cursor-pointer">
              {loadingImage ? (
                <div className="w-[180px] h-[180px] flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-white border-opacity-50"></div>
                </div>
              ) : (
                <img
                  src={imageFile ? URL.createObjectURL(imageFile) : imagePath}
                  alt="profile"
                  className="w-[180px] h-[180px] object-cover rounded-full"
                />
              )}

              </label>
              <input
                type="file"
                id="image"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>

            <div className="mb-4 mt-4">
              <label className="block text-[rgba(255,255,255,0.7)] font-bold mb-2">Name:</label>
              <input
                type="text"
                className="form-input p-2 bg-[rgba(217,217,217,0.2)] rounded-md w-full text-white"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="block text-[rgba(255,255,255,0.7)] font-bold mb-2">Email:</label>
              <input
                type="email"
                className="form-input p-2 bg-[rgba(217,217,217,0.2)] rounded-md w-full text-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="block text-[rgba(255,255,255,0.7)] font-bold mb-2">Change password:</label>
              <input
                type="password"
                className="form-input p-2 bg-[rgba(217,217,217,0.2)] rounded-md w-full text-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="block text-[rgba(255,255,255,0.7)] font-bold mb-2">Confirm password:</label>
              <input
                type="password"
                className="form-input p-2 bg-[rgba(217,217,217,0.2)] rounded-md w-full text-white"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <div className="flex justify-center">
              <button
              type="submit"
              disabled={loadingUpdateProfile}
              className={`py-2 px-4 rounded-md text-white ${
                loadingUpdateProfile ? "bg-gray-400 cursor-not-allowed" : "bg-[#1ADBE2] hover:bg-pink-600"
              }`}
            >
              {uploading ? "Updating..." : "Update Profile"}
            </button>
            </div>
          </form>
        </div>
      </div>
      {loadingUpdateProfile && <Loader />}
    </div>
  );
};

export default Profile;
