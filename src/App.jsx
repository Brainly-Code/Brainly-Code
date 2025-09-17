import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { setCredentials } from './redux/Features/authSlice';
import { useRefreshTokenMutation, useGetCurrentUserQuery, useLogoutMutation } from './redux/api/userSlice';
import BgLoader from './Components/ui/BgLoader';

const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [refresh, { isLoading: isRefreshing, error: refreshError }] = useRefreshTokenMutation();
  const [logout] = useLogoutMutation();
  const { data: userData, isLoading: isUserLoading, error: userError } = useGetCurrentUserQuery();
  const { loading, user } = useSelector((state) => state.auth);

  useEffect(() => {
    const checkAuth = async () => {
      // dispatch(setLoading(true));

      if (userData) {
        dispatch(setCredentials({ user: userData }));
        navigateToRole(userData?.role);

      } else if (userError) {
        console.log('No user data, attempting refresh'); // Debug
        try {
          const res = await refresh().unwrap();
          dispatch(setCredentials({ user: res.user }));
          navigateToRole(res.user.role);
        } catch (error) {
          console.error('Refresh failed:', error, { refreshError }); // Debug
          await logout();
          navigate('/login', { replace: true });
        }
      }
    };

    const navigateToRole = (role) => {
      if (role === 'USER') {
        navigate('/user', { replace: true });
      } else if (role === 'ADMIN' || role === 'SUPERADMIN') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/login', { replace: true });
      }
    };

    checkAuth();
  }, [dispatch, navigate, refresh, logout, userData, userError]);

  const { userInfo } = useSelector(state => state.auth);
  const [refreshToken] = useRefreshTokenMutation();

  useEffect(() => {
    const getToken = async () => {
      if (!userInfo?.access_token) {
        try {
          const res = await refreshToken().unwrap();
          // res should contain { access_token, user }
          dispatch(setCredentials({ user: res.user, access_token: res.access_token }));
        } catch (err) {
          // Not logged in or refresh failed
        }
      }
    };
    getToken();
  }, [userInfo, dispatch, refreshToken]);

  if (loading || isRefreshing || isUserLoading) {
    return <BgLoader />;
  }

  return (
    <div>
      <ToastContainer />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default App;