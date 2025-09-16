import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRefreshTokenMutation } from './redux/api/userSlice';
import { useEffect } from 'react';
import BgLoader from './Components/ui/BgLoader';
import { Logout, setCredentials, setLoading } from './redux/Features/authSlice';
import { jwtDecode } from 'jwt-decode';

const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [refresh, { isLoading: isRefreshing, error: refreshError }] = useRefreshTokenMutation();
  const { loading, accessToken, user } = useSelector((state) => state.auth);

  useEffect(() => {
    const checkAuth = async () => {
      dispatch(setLoading(true));
      console.log('App.jsx: Initial state:', { accessToken, user }); // Debug
      // Check if token is valid and not expired
      if (accessToken && user) {
        try {
          const decoded = jwtDecode(accessToken);
          console.log('App.jsx: Decoded token:', decoded); // Debug
          if (decoded.exp * 1000 > Date.now()) {
            // Ensure user.id is set from sub
            if (!user.id) {
              dispatch(setCredentials({
                user: { 
                  id: user?.id,
                  email: user?.email,
                  role: user?.role,
                  isPremium: user?.isPremium,
                },
                access_token: accessToken,
              }));
            }
            navigateToRole(user?.role);
            dispatch(setLoading(false));
            return;
          }
        } catch (error) {
          console.error('App.jsx: Invalid stored token:', error);
        }

        // Attempt refresh only if accessToken exists
        try {
          console.log('App.jsx: Attempting token refresh'); // Debug
          const res = await refresh().unwrap();
          console.log('App.jsx: Refresh response:', res); // Debug
          if (!res.access_token) {
            throw new Error('No access token in refresh response');
          }
          const decoded = jwtDecode(res.access_token);
          dispatch(setCredentials({
            user: {
              id: decoded.sub,
              email: decoded.email,
              role: decoded.role,
              isPremium: decoded.isPremium,
            },
            access_token: res.access_token,
          }));
          navigateToRole(user?.role);
        } catch (error) {
          console.error('App.jsx: Refresh failed:', error, { refreshError }); // Debug
          dispatch(Logout());
          navigate('/login', { replace: true });
        }
      } else {
        console.log('App.jsx: No accessToken or user, redirecting to /login'); // Debug
        navigate('/login', { replace: true });
      }
      dispatch(setLoading(false));
    };

    const navigateToRole = (role) => {
      console.log('App.jsx: Navigating to role:', role); // Debug
      if (role === 'USER') {
        navigate('/user', { replace: true });
      } else if (role === 'ADMIN' || role === 'SUPERADMIN') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/login', { replace: true });
      }
    };

    checkAuth();
  }, [dispatch, navigate, refresh]);

  if (loading || isRefreshing) {
    return <BgLoader />;
  }

  return (
    <div>
      <ToastContainer />
      <main>
        <Outlet /> {/* Render protected routes */}
      </main>
    </div>
  );
};

export default App;