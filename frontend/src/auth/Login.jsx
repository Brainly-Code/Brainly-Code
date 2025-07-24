import { FaFacebook, FaGoogle } from 'react-icons/fa'
import BrainlyCodeIcon from '../Components/BrainlyCodeIcon'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useLoginMutation } from '../redux/api/userSlice'
import { useDispatch, useSelector } from 'react-redux'
import { setCredentials } from '../redux/Features/authSlice'
import { toast } from 'react-toastify'
import Loader from '../Components/ui/Loader'
import { jwtDecode } from 'jwt-decode'
import Footer from '../Components/ui/Footer'


const Login = () => { 
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, {isLoading}] = useLoginMutation();
  const { userInfo } = useSelector((state) => state.auth);

  let role;

  if (userInfo && userInfo.access_token) {
    try {
      const decoded = jwtDecode(userInfo.access_token);
      role = decoded.role;
      console.log(role)
    } catch (error) {
      console.error("Invalid token", error);
    }
  }

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  
  let redirect;
  if(role === "USER"){
  redirect = sp.get('redirect') || '/user';
  } else {
    redirect = sp.get('redirect') || '/admin';
  }


  useEffect(() => {
    if( userInfo ) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]
);

  const submitHandler = async (e) => {
    e.preventDefault();

  try {
    const res = await login({ email, password }).unwrap();
    console.log(res);
    dispatch(setCredentials({ ...res }));
    navigate(redirect);
  } catch (error) {
    toast.error(error?.data?.message || error.message);
  }

  }

  return (
    <>
    <div className='bg-[#150f4ef1] text-white w-full bg-center pt-2 items-center bg-cover'>
      <header>
        <div className="mt-[0.2rem] w-[30%] m-auto">
           <h1 className="text-center heading font-bold text-2xl font-fredoka">Welcome Back</h1>
           <p className="text-center text-xs">Sign in to your Brainly code account</p>
           <div className="rounded bg-opacity-50 bg-[#1c1a30] pb-[1rem] text-gray-300 mt-2  m-auto items-center text-center md:w-[75%] sm:w-[100%]">
               <form action="" onSubmit={submitHandler} className="items-center p-5">
                <input type="email" id="email" name="email" onChange={e => setEmail(e.target.value)} className="block mt-2 text-md w-full m-auto border-blue-300 text-gray-300 required border-b-2  bg-transparent p-1 focus:pl-2  focus:border-blue-700 focus:outline-none focus:active:border-blue-400 " placeholder="Email" />
                <input type="password" id="password" name="password" onChange={e => setPassword(e.target.value)} className="block mb-5 mt-3 w-full m-auto border-blue-300 required text-gray-300 border-b-2 bg-transparent text-md p-1 focus:pl-2  focus:border-blue-700 focus:outline-none focus:active:border-blue-400 " placeholder="Password" />
                <input type="checkbox" name="terms" id="terms"  className="bg-[#13121C] mr-2 "/>
                <label htmlFor="terms" className="text-xs">I agree the <span className="text-blue-400">Terms of service </span> and <span className="text-blue-400">Privacy Policy</span></label>
                <button disabled={isLoading} type='submit' className="bg-blue-400 mt-2 px-8 rounded hover:bg-gradient-to-l hover:from-blue-500 hover:to-blue-400 bg-gradient-to-r from-[#47a7a5] to-[#18caca] py-2">{isLoading ? "Loging in": "Log into account"} </button>
                <p>Or Continue with</p>
              </form>
              <button className='bg-blue-950 p-2 rounded mr-10'>
                <FaGoogle className='inline mr-1'/>
                Google
              </button>
              <button className='bg-blue-950 p-2 rounded ml-8'>
                <FaFacebook className='inline mr-1'/>
                Facebook
              </button>
              <p className='y-4'>Dont have an account? <Link to={'/register'} className='ml-3 text-blue-500' >Sign up</Link></p>
           </div>
        </div>
      </header>
      <Footer />
    </div>
    </>
  )
}

export default Login