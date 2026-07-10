import { useRef, useEffect } from "react";
import { useClickClose } from "../../hooks/useClickClose";

const Notice = ({
  popupTitle,
  popupDetails,
  mountUnmount,
  setMountUnmount,
  closeBtnColor,
  closeBtnText,
}) => {
  const modalRef = useRef(null)
  useClickClose(modalRef, mountUnmount, setMountUnmount);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setMountUnmount(false);
      }
    };

    if (mountUnmount) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [mountUnmount, setMountUnmount]);

  useEffect(() => {
    if (mountUnmount) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mountUnmount]);

  // Disable scroll when modal is open
  useEffect(() => {
    if (mountUnmount) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
  }, [mountUnmount]);

  if (!mountUnmount) return null;

  return (
    <div className="fixed inset-0 z-999 flex justify-center items-center bg-black/50 px-4 overlay">
      <div
        ref={modalRef}
        className="w-4/5 md:max-w-md bg-white shadow-lg rounded-md px-5 py-8 text-center"
      >
        <h3 className="text-xl font-medium text-gray-700">{popupTitle}</h3>

        <p className="mt-3 text-sm text-gray-600">{popupDetails}</p>

        <div className="mt-6">
          <button
            onClick={() => setMountUnmount(false)}
            className={`px-6 h-10 w-full sm:w-32 mx-auto flex justify-center items-center rounded 
               text-sm font-semibold ${closeBtnColor}`}
          >
            {closeBtnText || "OK"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Notice;
