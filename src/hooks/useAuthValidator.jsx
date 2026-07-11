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

        if (
          res.status >= 200 &&
          res.status < 300 &&
          data &&
          data.id &&
          data.role
        ) {
          if (data.role === "ADMIN") {
            setUserId(data.id);
            setFullName(data.fullName ?? "");
            setEmail(data.emailId ?? "");
            setRole(data.role ?? null);
            setAuthenticated(true);
          }
        } else {
          if (import.meta.env.VITE_NODE_ENV !== "production") {
            console.warn(
              "[useAuthValidator] Auth check returned an unexpected payload:",
              res.status,
              data,
            );
          }
          setAuthenticated(false);
        }
      } catch (err) {
        if (!mounted) return;

        // Don't log if we intentionally aborted on unmount
        if (err?.name !== "CanceledError" && err?.code !== "ERR_CANCELED") {
          if (import.meta.env.VITE_NODE_ENV !== "production") {
            console.error(
              "[useAuthValidator] Auth check failed:",
              err?.response?.status,
              err?.response?.data ?? err?.message,
            );
          }
        }

        setAuthenticated(false);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    checkAuth();

    return () => {
      mounted = false;
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // setters from a Zustand store are stable; re-running per render isn't needed

  return {
    loading,
    authenticated,
  };
};
