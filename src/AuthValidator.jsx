import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiUrl from "./config/api.conf";
import envConfig from "./config/env.conf";
import { useAuthStore } from "./stores/useAuthStore";
import InternalErrorRes from "./utils/toast/InternalErrorRes";

export const AuthValidator = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  const { setUserId, setFullName, setEmail, setRole } = useAuthStore();

  useEffect(() => {
    let cancelled = false;

    const checkAuth = async () => {
      try {
        const res = await apiUrl.get(envConfig.fetch_logged_in_user_url, {
          withCredentials: true,
        });

        if (cancelled) return;

        const user = res.data;

        setIsAuthenticated(true);
        setUserId(user.id);
        setFullName(user.fullName);
        setEmail(user.emailId);
        setRole(user.role);
      } catch (error) {
        InternalErrorRes(error);
        if (cancelled) return;
        navigate("/sign-in", { replace: true });
      }
    };

    checkAuth();

    return () => {
      cancelled = true;
    };
  }, [navigate, setUserId, setFullName, setEmail, setRole, setIsAuthenticated]);

  return isAuthenticated;
};
