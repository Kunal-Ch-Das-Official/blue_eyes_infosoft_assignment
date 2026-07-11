import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import NProgress from "nprogress";

import Header from "../layout/Header";

const PrivateWeb = () => {
  const location = useLocation();

  useEffect(() => {
    NProgress.start();

    const timer = setTimeout(() => {
      NProgress.done();
    }, 300);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div className="min-h-screen xl:flex">
      <Header />

      <main className="flex-1 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
};

export default PrivateWeb;
