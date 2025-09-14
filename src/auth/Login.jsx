/* eslint-disable react-hooks/exhaustive-deps */
import { FaGoogle, FaGithub, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials, Logout } from '../redux/Features/authSlice';
import { toast } from 'react-toastify';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useLoginMutation, useRefreshTokenMutation } from '../redux/api/userSlice';

const Login = () => {
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [open, setOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [login, { isLoading }] = useLoginMutation();
  const [refresh] = useRefreshTokenMutation();

  const { user, access_token } = useSelector((state) => state.auth);


  const handleGoogleLogin = () => {
    window.location.href = "https://backend-hx6c.onrender.com/autho/google";
  };

  const handleGithubLogin = () => {
    window.location.href = "https://backend-hx6c.onrender.com/autho/github";
  };

  const redirectFromQuery = new URLSearchParams(location.search).get('redirect');

  const getDefaultRedirect = (role) => {
    if (role === 'ADMIN') return '/admin';
    return '/user';
  };

  // Auto-refresh session if user is already logged in
  useEffect(() => {
  if (access_token) {
    const redirectPath = redirectFromQuery || getDefaultRedirect(acess_token?.role);
    if (location.pathname === '/login' || location.pathname === '/register') {
      navigate(redirectPath, { replace: true });
    }
  }
}, [access_token, navigate, location.pathname, redirectFromQuery]);


  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ user: res.user, access_token: res.access_token }));
      const redirectPath = redirectFromQuery || getDefaultRedirect(res.user.role);
      navigate(redirectPath, { replace: true });
    } catch (error) {
      toast.error(error?.data?.message || error.message);
    }
  };

  const handleContinue = (e) => {
    e.preventDefault();
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      toast.error('Please enter a valid email.');
      return;
    }
    setOpen(true);
  };

  return (
    <div className="min-h-screen pt-[5rem] bg-[#070045] text-white flex flex-col items-center justify-between">
      <button className="py-3 ml-5 px-4 mt-4 text-gray-200 rounded-full bg-gradient-to-r from-[#00ffee] to-purple-400 font-semibold hover:opacity-90 transition text-sm lg:absolute lg:top-4 lg:left-4">
        <Link to="/">Back to Home</Link>
      </button>

      <header className="flex flex-col sm:absolute sm:top-10 sm:mt-[rem] lg:mt-[0] lg:top-20 items-center lg:pt-6 w-full">
        <div className="w-full max-w-md px-4 sm:px-6 lg:px-8">
          <div className="bg-[#070045] rounded-lg border-[#3A3A5A] border p-8 shadow-lg">
            <h1 className="text-center text-3xl font-bold mb-2">Welcome Back</h1>
            <p className="text-center text-gray-400 mb-8">
              Sign in to your Brainly code account
            </p>

            <form onSubmit={submitHandler} className="flex flex-col items-center">
              {!open ? (
                <>
                  <div className="w-full mb-4">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full py-3 px-4 rounded-full bg-[#070045] text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-1 border-[#3A3A5A] border focus:ring-[#8A2BE2]"
                      placeholder="Email"
                      value={email}
                      required
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleContinue}
                    className="w-full bg-gradient-to-r rounded-full from-[#2DD4BF] to-[#8A2BE2] text-white py-3 font-semibold hover:opacity-90 transition duration-300"
                  >
                    Continue
                  </button>

                  <div className="flex justify-between items-center my-3 gap-3">
                    <hr className="w-full border-gray-600" />
                    <span className="text-gray-400">or</span>
                    <hr className="w-full h-1 border-gray-600" />
                  </div>
                </>
              ) : (
                <>
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

                  <div className="flex w-full gap-4 mt-4">
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      className="flex-1 px-4 py-3 rounded-full border border-[#8A2BE2] text-[#8A2BE2] font-semibold hover:bg-[#8A2BE2] hover:text-white transition duration-300"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 bg-gradient-to-r from-[#2DD4BF] to-[#8A2BE2] text-white py-3 rounded-full font-semibold hover:opacity-90 transition duration-300 flex items-center justify-center"
                    >
                      {isLoading ? (
                        <span className="w-5 h-5 border-2 border-white border-b-transparent rounded-full animate-spin"></span>
                      ) : (
                        'Log In'
                      )}
                    </button>
                  </div>
                </>
              )}
            </form>

            {!open && (
              <>
                <button
                  onClick={handleGoogleLogin}
                  type="button"
                  className="w-full flex items-center justify-center bg-[#00137462] text-gray-300 py-3 rounded-full mb-3 hover:bg-[#001374a9] transition duration-300"
                >
                  <FaGoogle className="inline mr-3 text-lg" />
                  Continue With Google
                </button>
                <button
                  onClick={handleGithubLogin}
                  type="button"
                  className="w-full flex items-center justify-center bg-[#00137462] text-gray-300 py-3 rounded-full mb-6 hover:bg-[#001374a9] transition duration-300"
                >
                  <FaGithub className="inline mr-3 text-lg" />
                  Continue With Github
                </button>
              </>
            )}

            {!open && (
              <p className="text-center text-gray-400">
                Don't have an account?{' '}
                <Link to={'/register'} className="ml-1 text-[#8A2BE2] hover:underline">
                  Sign Up
                </Link>
              </p>
            )}
          </div>
        </div>
      </header>
    </div>
  );
};

export default Login;
