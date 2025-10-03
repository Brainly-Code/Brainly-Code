import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useGetCurrentUserQuery, useRefreshTokenMutation } from './redux/api/apiSlice';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials, logout } from './redux/Features/authSlice';
import BgLoader from './Components/ui/BgLoader';


const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { access_token, user } = useSelector(state => state.auth);
  const [refreshToken] = useRefreshTokenMutation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      if (!access_token) {
        try {
          const res = await refreshToken().unwrap();
          dispatch(setCredentials({ user: res.user, access_token: res.access_token }));
          setLoading(false);
        } catch (err) {
          dispatch(logout());
          navigate('/login', { replace: true });
        }
      }
    };
    restoreSession();
  }, [access_token, dispatch, refreshToken]);

  if(loading) {
    return <BgLoader />
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