import { useCallback, useEffect } from "react";

export const useClickClose = (sidebarRef, isSidebarOpen, setIsSidebarOpen) => {
  const handleClickOutside = useCallback(
    (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        if (isSidebarOpen === true) {
          setIsSidebarOpen(false);
        }
      }
    },
    [isSidebarOpen, setIsSidebarOpen, sidebarRef],
  );

  // Is side bar is open then listen the event otherwise remove listener
  useEffect(() => {
    if (isSidebarOpen === true) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    // Clean up event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarOpen, handleClickOutside]);
};
