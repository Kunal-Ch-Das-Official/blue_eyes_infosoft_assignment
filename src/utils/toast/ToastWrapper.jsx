import { useEffect, useState } from "react";
import { ToastContainer, Bounce } from "react-toastify";

const ToastWrapper = () => {
  const [position, setPosition] = useState("bottom-right");

  useEffect(() => {
    const updatePosition = () => {
      if (window.innerWidth < 768) {
        setPosition("top-right");
      } else {
        setPosition("bottom-right");
      }
    };

    updatePosition(); // Initial run
    window.addEventListener("resize", updatePosition);
    return () => window.removeEventListener("resize", updatePosition);
  }, []);

  return (
    <div className="z-999999">
      <ToastContainer
        position={position}
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
    </div>
  );
};

export default ToastWrapper;
