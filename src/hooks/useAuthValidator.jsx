import { useEffect, useState } from "react";
import { useAuthStore } from "../stores/useAuthStore";
import apiUrl from "../config/api.conf";
import envConfig from "../config/env.conf";

export const useAuthValidator = () => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  const { setUserId, setFullName, setEmail, setRole } = useAuthStore();

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    const checkAuth = async () => {
      try {
        const res = await apiUrl.get(envConfig.FETCH_LOGGED_IN_ADMIN_URL, {
          withCredentials: true,
          signal: controller.signal,
        });

        if (!mounted) return;

        const data = res?.data;

        // CRITICAL FIX: If the backend returns a USER role on the ADMIN app,
        // treat it as an unauthenticated state for this portal.
        if (
          res.status >= 200 &&
          res.status < 300 &&
          data?.id &&
          data?.role === "ADMIN"
        ) {
          setUserId(data.id);
          setFullName(data.fullName ?? "");
          setEmail(data.emailId ?? "");
          setRole(data.role);
          setAuthenticated(true);
        } else {
          // If role is "USER", completely wipe the state
          handleAuthFailure();
        }
      } catch (err) {
        console.log(err);
        if (!mounted) return;
        handleAuthFailure();
      } finally {
        if (mounted) setLoading(false);
      }
    };

    const handleAuthFailure = () => {
      setUserId(null);
      setFullName("");
      setEmail("");
      setRole(null);
      setAuthenticated(false);
    };

    checkAuth();

    return () => {
      mounted = false;
      controller.abort();
    };
  }, [setUserId, setFullName, setEmail, setRole]);

  return {
    loading,
    authenticated,
  };
};
