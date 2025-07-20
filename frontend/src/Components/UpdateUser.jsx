import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import { useGetCurrentUserQuery, useGetProfileImageQuery, useUpdateUserMutation } from "../redux/api/userSlice";
import { setCredentials } from "../redux/Features/authSlice";
import Loader from "./ui/Loader";
import profileFallback from "../assets/profile.png";

const Profile = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const token = jwtDecode(userInfo.access_token);

  const { data: user } = useGetCurrentUserQuery(token.sub);
  const { data: image } = useGetProfileImageQuery(token.sub);
  const [updateProfile, { isLoading: loadingUpdateProfile }] = useUpdateUserMutation();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [hash, setHash] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    setUsername(user?.username || '');
    setEmail(user?.email || '');
  }, [user]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (hash !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("email", email);
      formData.append("hash", hash);
      if (imageFile) formData.append("image", imageFile);

      const res = await updateProfile({ id: token.sub, formData }).unwrap();
      dispatch(setCredentials({ ...res }));
      toast.success("User profile updated successfully");
    } catch (err) {
      toast.error(err?.data?.message || err.message);
    }
  };

  const imagePath = image?.path
    ? `http://localhost:3000/uploads/profile-images/${image?.path}`
    : profileFallback;

  return (
    <div className="h-full w-full bg-[#110167] p-4">
      <div className="flex justify-center md:space-x-4">
        <div className="md:w-1/3">
          <h1 className="text-xl font-bold mb-7 text-[#989898] text-center">Update Profile</h1>
          <form onSubmit={submitHandler}>
            <div className="w-48 h-48 overflow-hidden hover:cursor-pointer bg-white rounded-full mx-auto flex items-center justify-center">
              <label htmlFor="image" className="cursor-pointer">
                <img
                  src={imageFile ? URL.createObjectURL(imageFile) : imagePath}
                  alt="profile"
                  className="w-[180px] h-[180px] object-cover rounded-full"
                />
              </label>
              <input
                type="file"
                id="image"
                accept="image/*"
                className="hidden"
                onChange={(e) => setImageFile(e.target.files[0])}
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
                value={hash}
                onChange={(e) => setHash(e.target.value)}
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
              <button type="submit" className="bg-[#1ADBE2] text-white py-2 px-4 rounded-md hover:bg-pink-600">
                Update Profile
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
