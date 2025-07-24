import { FaGoogle, FaGithub } from 'react-icons/fa' // Changed FaFacebook to FaGithub based on the image
import BrainlyCodeIcon from '../Components/BrainlyCodeIcon' // Not used in the provided UI but kept for logic
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRegisterMutation } from '../redux/api/userSlice'
import { setCredentials } from '../redux/Features/authSlice'
import { toast } from 'react-toastify'
import Loader from '../Components/ui/Loader' // Not used in the provided UI but kept for logic
import Footer from '../Components/ui/Footer'

const Register = () => {

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(''); // State for role, though the checkbox only sets "USER"

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();
  const { userInfo } = useSelector(state => state.auth);

  const search = useLocation();
  const sp = new URLSearchParams(search);
  let redirect;
  if (role === "USER") {
    redirect = sp.get('redirect') || '/user';
  } else if (role === "ADMIN") {
    redirect = sp.get('redirect') || '/admin';
  }


  useEffect(() => {
    if (userInfo) {
      navigate(redirect)
    }
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault()

    try {
      // Ensure role is set before submitting if it's tied to the checkbox
      // For simplicity, assuming the checkbox implies 'USER' role for registration
      const res = await register({ role: "USER", username, email, password }).unwrap(); // Hardcoding role to USER as per checkbox logic
      console.log(res);
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
    } catch (error) {
      console.log(error?.data?.message);
      toast.error(error?.data?.message || error.message);
    }
  }

  // The Loader component is handled by the isLoading state on the button itself now
  // if (isLoading) return <Loader />

  return (
    <>
      <div className='min-h-screen bg-[#1A182C] text-white flex flex-col items-center justify-between'>
        <header className="flex flex-col items-center pt-16 w-full">
          <div className="w-full max-w-md px-4 sm:px-6 lg:px-8">
            <h1 className="text-center text-3xl font-bold mb-2">Create Your Account</h1> {/* Changed text */}
            <p className="text-center text-gray-400 mb-8">Code With BrainlyCode</p> {/* Changed text */}

            <div className="bg-[#1D1B36] rounded-lg p-8 shadow-lg">
              <form onSubmit={submitHandler} className="flex flex-col items-center">
                {/* Username Input */}
                <div className="w-full mb-4">
                  <input
                    type="text"
                    required
                    id="username"
                    onChange={e => setUsername(e.target.value)}
                    name="username"
                    className="w-full p-3 rounded-md bg-[#252340] text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#8A2BE2]"
                    placeholder="Name"
                  />
                </div>
                {/* Email Input */}
                <div className="w-full mb-4">
                  <input
                    type="email"
                    onChange={e => setEmail(e.target.value)}
                    required
                    id="email"
                    name="email"
                    className="w-full p-3 rounded-md bg-[#252340] text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#8A2BE2]"
                    placeholder="Email"
                  />
                </div>
                {/* Password Input */}
                <div className="w-full mb-4">
                  <input
                    autoComplete='true'
                    type="password"
                    onChange={e => setPassword(e.target.value)}
                    required
                    id="password"
                    name="password"
                    className="w-full p-3 rounded-md bg-[#252340] text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#8A2BE2]"
                    placeholder="Password"
                  />
                </div>

                {/* Terms and Privacy Policy Checkbox */}
                <div className="flex items-center w-full mb-6 text-sm">
                  <input
                    type="checkbox"
                    onChange={() => setRole("USER")} // Your original logic for setting role
                    name="terms"
                    id="terms"
                    required
                    className="form-checkbox h-4 w-4 text-[#8A2BE2] bg-gray-700 border-gray-600 rounded focus:ring-[#8A2BE2] mr-2"
                  />
                  <label htmlFor="terms" className="text-gray-400">
                    I agree the <span className="text-[#8A2BE2]">Terms of service </span> and <span className="text-[#8A2BE2]">Privacy Policy</span>
                  </label>
                </div>

                {/* Create Account Button */}
                <button
                  type='submit'
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-[#2DD4BF] to-[#8A2BE2] text-white py-3 rounded-md font-semibold hover:opacity-90 transition duration-300 flex items-center justify-center"
                >
                  {isLoading ? (
                    <span className="w-5 h-5 border-2 border-white border-b-transparent rounded-full animate-spin"></span>
                  ) : (
                    "Create Account"
                  )}
                </button>

                {/* Or Continue with */}
                <p className="my-6 text-gray-400">Or</p>

                {/* Social Login Buttons */}
                <button className='w-full flex items-center justify-center bg-[#252340] text-gray-300 py-3 rounded-md mb-3 hover:bg-[#322F50] transition duration-300'>
                  <FaGoogle className='inline mr-3 text-lg' />
                  Continue With Google
                </button>
                <button className='w-full flex items-center justify-center bg-[#252340] text-gray-300 py-3 rounded-md mb-6 hover:bg-[#322F50] transition duration-300'>
                  <FaGithub className='inline mr-3 text-lg' /> {/* Changed to FaGithub */}
                  Continue With Github
                </button>

                {/* Already have an account? Sign in */}
                <p className='text-gray-400'>Already have an account? <Link to={'/login'} className='ml-1 text-[#8A2BE2] hover:underline'>Sign in</Link></p>
              </form>
            </div>
          </div>
        </header>

        <Footer />
      </div>
    </>
  )
}

export default Register