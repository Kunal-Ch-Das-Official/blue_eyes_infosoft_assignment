import { useState } from "react";
import apiUrl from "../config/api.conf";
import envConfig from "../config/env.conf";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import InternalErrorRes from "../utils/toast/InternalErrorRes";
import Confirmation from "../utils/modals/Confirmation";
import { useAuthStore } from "../stores/useAuthStore";

const Header = () => {
  const navigate = useNavigate();
  const {fullName} = useAuthStore()
  const [logoutConfirmation, setLogoutConfirmation] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // Mobile menu state




  const handleConfirmSignout = async () => {
    try {
      const response = await apiUrl.post(
        envConfig.EXISTING_ADMIN_LOGOUT_URL,
        {},
        {
          withCredentials: true,
        },
      );

      if (!response.data) {
        return toast.error(
          <div>
            <strong className="text-rose-600">Failed!</strong>
            <p className="text-xs text-gray-800">
              Something went wrong! Response were not coming. Please try again.
            </p>
          </div>,
        );
      } else {
        navigate("/sign-in");
      }
    } catch (error) {
      InternalErrorRes(error);
    }
  };

  return (
    <>
      {logoutConfirmation && (
        <Confirmation
          popupTitle="Confirm Logout"
          popupDetails="Do you really want to logout?"
          mountUnmount={true}
          setMountUnmount={() => setLogoutConfirmation((prev) => !prev)}
          confirmBtnColor="bg-amber-600 text-white rounded px-4 py-2 text-sm"
          confirmBtnText="Logout"
          cancelBtnColor="text-gray-500 text-sm px-4"
          cancelBtnText="Cancel"
          confirmHandler={handleConfirmSignout}
        />
      )}

      <nav className="bg-slate-900 text-white shadow-md fixed w-full top-0 left-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="shrink-0">
              <Link
                to="/dashboard"
                className="text-xl font-bold tracking-wider text-indigo-400 hover:text-indigo-300 transition duration-200"
              >
                Sports Club Admin
              </Link>
              <br />
              <div className="flex gap-1 items-center flex-row">
                <p className="text-xs">Access:</p>
                <p className="text-xs text-yellow-400">{fullName}</p>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex space-x-8 font-medium">
              <Link
                to="/dashboard"
                className="hover:text-indigo-400 transition duration-200"
              >
                Dashboard
              </Link>
              <a
                href="#about"
                className="hover:text-indigo-400 transition duration-200"
              >
                About
              </a>
              <a
                href="#price"
                className="hover:text-indigo-400 transition duration-200"
              >
                Price
              </a>
              <a
                href="#contact"
                className="hover:text-indigo-400 transition duration-200"
              >
                Contact
              </a>
            </div>

            {/* Profile Dropdown & Mobile Menu Button */}
            <div className="flex items-center space-x-4">
              {/* Profile Dropdown */}
              <div className="relative">
                   <button
                      onClick={() => {
                        setLogoutConfirmation((prev) => !prev);
                        console.log("Logging out...");
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-red-400 rounded-full hover:bg-red-600 hover:text-white transition duration-150"
                    >
                      Logout
                    </button>

  
              </div>

              {/* Mobile Menu Button */}
              <div className="flex md:hidden">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  type="button"
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-slate-800 focus:outline-none"
                  aria-controls="mobile-menu"
                  aria-expanded={isOpen}
                >
                  <span className="sr-only font-semibold">Open main menu</span>
                  {isOpen ? (
                    // Close Icon
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  ) : (
                    // Hamburger Icon
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu Panel */}
        {isOpen && (
          <div className="md:hidden bg-slate-800 px-2 pt-2 pb-3 space-y-1 sm:px-3 shadow-inner">
            <a
              href="#home"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-200 hover:bg-slate-700 hover:text-white transition"
            >
              Home
            </a>
            <a
              href="#about"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-200 hover:bg-slate-700 hover:text-white transition"
            >
              About
            </a>
            <a
              href="#price"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-200 hover:bg-slate-700 hover:text-white transition"
            >
              Price
            </a>
            <a
              href="#contact"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-200 hover:bg-slate-700 hover:text-white transition"
            >
              Contact
            </a>
          </div>
        )}
      </nav>
    </>
  );
};

export default Header;
