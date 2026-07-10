import { useEffect } from "react";
import NProgress from "nprogress";
import { Outlet, useLocation } from "react-router-dom";
import Header from "../layout/Header";
import Footer from "../layout/Footer";

const LayoutContent = () => {
  const location = useLocation();

  useEffect(() => {
    NProgress.start();
    const timeout = setTimeout(() => {
      NProgress.done();
    }, 300);
    return () => clearTimeout(timeout);
  }, [location.pathname]);

  return (
    <div className="min-h-screen xl:flex">

      <Header />
      <Outlet />
      <Footer />
    </div>
  );
};

const PrivateWeb = () => {
  return <LayoutContent />;
};

export default PrivateWeb;
