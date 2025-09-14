import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRefreshTokenMutation } from "./redux/api/userSlice";
import { useEffect } from "react";
import BgLoader from "./Components/ui/BgLoader";
import { Logout, setCredentials, setLoading } from "./redux/Features/authSlice";
import { jwtDecode } from "jwt-decode";

const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [refresh] = useRefreshTokenMutation();
  const { loading } = useSelector((state) => state.auth);
  let userToken;

  useEffect(() => {
    const checkAuth = async () => {
      dispatch(setLoading(true));
      try {
        const res = await refresh().unwrap();
        
        const user = jwtDecode(res.access_token);
        console.log("Refresh response:", res);
        dispatch(setCredentials({user: jwtDecode(res?.access_token), access_token: res.access_token }));

        if(user?.role === "USER") {
          console.log("USER role is user");
          return navigate("/user", { replace: true });
        }else if(user?.role === "ADMIN") {
          console.log("USER role is admin");
          return navigate("/admin", { replace: true });
        }else if(user?.role === "SUPERADMIN") {
          console.log("USER role is super admin");
          return navigate("/admin", { replace: true });
        }
        
      } catch (error) {
        console.error("Refresh failed:", error);
        dispatch(Logout());
      } finally {
        dispatch(setLoading(false));
      }
    };

    checkAuth();
  }, [dispatch, refresh]);

  if (loading) {
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