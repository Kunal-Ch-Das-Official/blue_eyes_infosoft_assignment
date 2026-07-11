import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import NProgress from "nprogress";

import Header from "../layout/Header";
import Footer from "../layout/Footer";

const PrivateDashboard = () => {
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

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default PrivateDashboard;
