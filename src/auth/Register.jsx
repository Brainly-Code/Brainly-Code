import { FaGoogle, FaGithub, FaEyeSlash, FaEye } from 'react-icons/fa';
import BrainlyCodeIcon from '../Components/BrainlyCodeIcon';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRegisterMutation } from '../redux/api/userSlice';
import { setCredentials } from '../redux/Features/authSlice';
import { toast } from 'react-toastify';
import Footer from '../Components/ui/Footer';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('USER'); // Default to USER
  const [isError, setIsError] = useState('')
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [register, { isLoading }] = useRegisterMutation();
  const { userInfo } = useSelector(state => state.auth);

  const location = useLocation();
  const sp = new URLSearchParams(location.search);
  const redirect = sp.get('redirect') || (role === 'ADMIN' ? '/admin' : '/user');

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:3000/autho/google";
  };
  
  const handleGithubLogin = () => {
    window.location.href = "http://localhost:3000/autho/github";
  };

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const res = await register({ role, username, email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
    } catch (error) {
       setIsError(error?.data?.message[0] || error.message[0]);
      console.log(isError);
      toast.error("Registration failed");
    }
  };

  console.log(isError);

  return (
    <div className='min-h-screen bg-[#070045] text-white flex flex-col items-center justify-between'>
      <button className='py-3 ml-5 px-4 mt-4 text-gray-200 rounded-full bg-gradient-to-r from-[#00ffee] to-purple-400  font-semibold hover:opacity-90 transition text-sm lg:absolute lg:top-4 lg:left-4'>
            <Link to="/">
              Back to Home
            </Link>
        </button>
      <header className="flex flex-col items-center pt-8 w-full">
        <div className="w-full max-w-md px-4 sm:px-6 lg:px-8">
          <div className="bg-[#070045] rounded-lg border-[#3A3A5A] border p-6 shadow-lg">
            <h1 className="text-center text-3xl font-bold mb-2">Create Your Account</h1>
            <p className="text-center text-gray-400 mb-8">Code With BrainlyCode</p>
            <form onSubmit={submitHandler} className="flex flex-col items-center">
              <div className="w-full mb-4">
                <input
                  type="text"
                  required
                  id="username"
                  onChange={e => setUsername(e.target.value)}
                  name="username"
                  className="w-full py-3 px-4 rounded-full bg-[#070045] text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-1 border-[#3A3A5A] border focus:ring-[#8A2BE2]"
                  placeholder="Name"
                />
              </div>
              <div className="w-full mb-4">
                <input
                  type="email"
                  onChange={e => setEmail(e.target.value)}
                  required
                  id="email"
                  name="email"
                  className="w-full py-3 px-4 rounded-full bg-[#070045] text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-1 border-[#3A3A5A] border focus:ring-[#8A2BE2]"
                  placeholder="Email"
                />
              </div>
              <div className="w-full mb-4 relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full py-3 px-4 rounded-full bg-[#070045] text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-1 border-[#3A3A5A] border focus:ring-[#8A2BE2]"
                  placeholder="Password"
                  value={password}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 focus:outline-none"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {isError && (<div className="w-full mb-4 text-center text-red-500 text-sm">{isError}</div>)}
              <div className="flex items-center w-full mb-6 text-sm">
                <input
                  type="checkbox"
                  onChange={() => setRole('USER')}
                  name="terms"
                  id="terms"
                  required
                  className="form-checkbox h-4 w-4 text-[#8A2BE2] bg-gray-700 border-gray-600 rounded focus:ring-[#8A2BE2] mr-2"
                />
                <label htmlFor="terms" className="text-gray-400">
                  I agree the <span className="text-[#8A2BE2]">Terms of service</span> and <span className="text-[#8A2BE2]">Privacy Policy</span>
                </label>
              </div>
              <button
                type='submit'
                disabled={isLoading}
                className="w-full bg-gradient-to-r rounded-full from-[#2DD4BF] to-[#8A2BE2] text-white py-3 font-semibold hover:opacity-90 transition duration-300"
              >
                {isLoading ? 'Creating User...' : 'Create Account'}
              </button>
              <div className="flex justify-between items-center my-3 gap-3">
                <hr className="w-full border-gray-600" />
                <span className="text-gray-400">or</span>
                <hr className="w-full border-gray-600" />
              </div>
              <button onClick={handleGoogleLogin} className='w-full flex items-center justify-center bg-[#00137462] text-gray-300 py-3 rounded-full mb-3 hover:bg-[#001374a9] transition duration-300'>
                <FaGoogle className='inline mr-3 text-lg' />
                Continue With Google
              </button>
              <button onClick={handleGithubLogin} className='w-full flex items-center justify-center bg-[#00137462] text-gray-300 py-3 rounded-full mb-3 hover:bg-[#001374a9] transition duration-300'>
                <FaGithub className='inline mr-3 text-lg' />
                Continue With Github
              </button>
              <p className='text-gray-400'>Already have an account?
                <Link to={'/login'} className='ml-1 text-[#8A2BE2] hover:underline'>Sign in</Link>
              </p>
            </form>
          </div>
        </div>
      </header>
      <Footer />
    </div>
  );
};

export default Register;