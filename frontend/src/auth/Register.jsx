import { FaFacebook, FaGoogle } from 'react-icons/fa'
import BrainlyCodeIcon from '../Components/BrainlyCodeIcon'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRegisterMutation } from '../redux/api/userSlice'
import { setCredentials } from '../redux/Features/authSlice'
import { toast } from 'react-toastify'
import Loader from '../Components/ui/Loader'
import Footer from '../Components/ui/Footer'

const Register = () => {

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();
  const { userInfo } = useSelector(state => state.auth);

  const search = useLocation();
  const sp = new URLSearchParams(search);
  let redirect;
  if(role === "USER"){
    redirect = sp.get('redirect') || '/user';
  } else if(role === "ADMIN") {
    redirect = sp.get('redirect') || '/admin';
  }
  

  useEffect(() => {
    if(userInfo){
      navigate(redirect)
    }
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault()

    try {
      const res = await register({ role, username, email, password }).unwrap();
      console.log(res);
      dispatch(setCredentials({...res}));
      navigate(redirect);
    } catch (error) {
      console.log(error?.data?.message);
      toast.error(error?.data?.message || error.message);
    }
  }  

  if (isLoading) return <Loader />

  return (
    <>
    <div className='bg-[#150f4ef1] text-white w-full bg-center pt-2 items-center bg-cover'>
      <header>
        <div className="">
           <h1 className="text-center heading font-bold text-2xl font-fredoka">Create an Account</h1>
           <p className="text-center text-sm">Start your coding journey with Brainly Code</p>
           <div className="rounded bg-opacity-40 text-gray-300 pb-1 mt-2 m-auto bg-[#1c1a30] items-center text-center w-[25%]">
               <form action="" onSubmit={submitHandler} className="items-center px-7 pb-4 pt-7">
                <input type="text" required id="username" onChange={e => setUsername(e.target.value)} name="username" className="focus:pl-2 block w-full m-auto border-blue-300 text-gray-300 border-b-2  bg-transparent text-[1rem] p-1 focus:border-blue-700 focus:outline-none  " placeholder="Name" />
                <input type="email" onChange={e => setEmail(e.target.value)} required id="email" name="email" className="focus:pl-2 block mt-3 w-full m-auto border-blue-300 text-gray-300 border-b-2  bg-transparent text-[1rem] p-1  focus:border-blue-700 focus:outline-none focus:active:border-blue-400 " placeholder="Email" />
                <input autoComplete='true' type="password" onChange={e => setPassword(e.target.value)} required id="password" name="password" className="focus:pl-2 block mb-5 mt-3 w-full m-auto border-blue-300 text-gray-300 border-b-2 bg-transparent text-[1rem] p-1  focus:border-blue-700 focus:outline-none focus:active:border-blue-400 " placeholder="Password" />
                <input type="checkbox" onChange={() => setRole("USER")} name="terms" id="terms" required className="bg-[#13121C] mr-2 " style={{width: '1rem', height: '1rem', backgroundColor: "#13121C"}}/>
                <label htmlFor="terms" className="text-xs">I agree the <span className="text-blue-400">Terms of service </span> and <span className="text-blue-400">Privacy Policy</span></label>
                <button className="bg-blue-400 mt-2 px-8 rounded hover:bg-gradient-to-l hover:from-blue-700 hover:to-blue-500 bg-gradient-to-l from-blue-600 to-blue-400 py-2">Sign up</button>
                <p>Or Continue with</p>
              </form>
              <button className='hover:bg-[#10102d] bg-blue-950 p-2 rounded mr-10'>
                <FaGoogle className='inline mr-1'/>
                Google
              </button>
              <button className='hover:bg-[#10102d] bg-blue-950 p-2 rounded ml-8'>
                <FaFacebook className='inline mr-1'/>
                Facebook
              </button>
              <p className='my-4'>Already have an account? <Link to={'/login'} className='ml-3 text-blue-500' >Sign in</Link></p>
           </div>
        </div>
      </header>
      
      <Footer />
    </div>
    </>
  )
}

export default Register