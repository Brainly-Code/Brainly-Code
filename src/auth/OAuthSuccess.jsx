import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { setCredentials } from "../redux/Features/authSlice";
import { useGetCurrentUserQuery } from "../redux/api/apiSlice";
import { toast } from "react-toastify";

const OAuthSuccess = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Get token from URL
  const params = new URLSearchParams(location.search);
  const access_token = params.get("token");

  // Fetch user info with the token
  const { data: user, isSuccess } = useGetCurrentUserQuery(undefined, {
    skip: !access_token,
    refetchOnMountOrArgChange: true,
    // Pass the token in the header (see apiSlice prepareHeaders)
  });

  useEffect(() => {
    if (access_token && user) {
      dispatch(setCredentials({ user, access_token }));
      toast.success("Login successful!");
      if (user.role === "ADMIN" || user.role === "SUPERADMIN") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/user", { replace: true });
      }
    }
    if (!access_token) {
      toast.error("OAuth failed. Please try again.");
      navigate("/login");
    }
  }, [access_token, user, dispatch, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen text-white bg-[#070045]">
      <div className="text-xl">Logging you in...</div>
    </div>
  );
};

export default OAuthSuccess;