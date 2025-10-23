import authApi from "@/api/authApi";
import { useAppDispatch } from "@/store/store";
import { useEffect, useState } from "react";
import { logout as logoutAction } from "@/features/auth/authSlice";
import { Spin } from "antd";
import { useNavigate } from "react-router-dom"; // 💡 IMPORT useNavigate

const Logout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate(); // 💡 Initialize useNavigate hook
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleLogout = async () => {
      setIsLoading(true);
      try {
        // 1. Call the API to invalidate the session/token on the server
        await authApi.logout();
      } catch (error: any) {
        // Log the error but proceed to client logout
        console.error(
          "Logout API failed, forcing client logout:",
          error.message
        );
      } finally {
        // 2. Clear the local state (Redux) regardless of API success/failure
        dispatch(logoutAction());

        // 3. Clear loading state
        setIsLoading(false);

        // 4. Redirect the user to the login or home page
        // Use `replace: true` to prevent the user from navigating back to this
        // "Logout" page using the browser's back button.
        navigate("/login", { replace: true });
      }
    };

    handleLogout();

    // Cleanup function: good practice for effects that cause navigation
    return () => {
      // Any cleanup if necessary, though unlikely for a simple logout
    };
  }, [dispatch, navigate]); // Added navigate to dependency array

  // --- Render logic ---

  // Note on Spin: Removed the undefined `percent` prop.
  return (
    <Spin
      spinning={isLoading}
      fullscreen
      tip="Logging out..." // Added a helpful tip
    />
  );
};

export default Logout;
