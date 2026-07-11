import { useRef, useEffect } from "react";
import { useClickClose } from "../../hooks/useClickClose";
import { CheckCircle2, XCircle } from "lucide-react";

const StatusUpdateConfirmation = ({
  popupTitle = "Update Application Status",
  popupDetails = "Please evaluate the candidate's profile and choose an operational path forward.",
  mountUnmount,
  setMountUnmount,
  setStatusState, // The state setter passed down from the parent
  confirmHandler, // Optional additional logic function (e.g., API call trigger)
}) => {
  const modalRef = useRef(null);
  useClickClose(modalRef, mountUnmount, setMountUnmount);

  // Keyboard shortcut listener (Escape key to cancel/close safely)
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

  // Premium scroll locking hook
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

  if (!mountUnmount) return null;

  // Handles state setting and execution of parent triggers
  const handleSelection = (decision) => {
    setStatusState(decision); // Stores "APPROVED" or "REJECTED"
    if (confirmHandler) confirmHandler(decision);
    setMountUnmount(false); // Closes the modal
  };

  return (
    <div className="fixed inset-0 z-99999 flex justify-center items-center bg-slate-950/60 backdrop-blur-sm px-4 transition-all duration-300">
      <div
        ref={modalRef}
        className="w-full max-w-md bg-slate-900 border border-slate-800 shadow-2xl rounded-2xl p-6 text-center animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Dynamic Premium Header Visual */}
        <div className="mx-auto my-3 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <h3 className="text-xl font-semibold text-slate-100 tracking-tight mt-4">
          {popupTitle}
        </h3>

        <p className="mt-2.5 text-sm text-slate-400 leading-relaxed px-2">
          {popupDetails}
        </p>

        {/* Binary Choice Action Row */}
        <div className="mt-8 flex items-center gap-3 w-full">
          {/* REJECT BUTTON */}
          <button
            onClick={() => handleSelection("REJECTED")}
            className="flex-1 flex items-center justify-center gap-2 h-11 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-sm font-semibold transition-all hover:scale-[1.01] active:scale-[0.99]"
          >
            <XCircle size={16} />
            Reject Application
          </button>

          {/* APPROVE BUTTON */}
          <button
            onClick={() => handleSelection("APPROVED")}
            className="flex-1 flex items-center justify-center gap-2 h-11 rounded-xl border border-emerald-500/30 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 text-sm font-semibold transition-all hover:scale-[1.01] active:scale-[0.99]"
          >
            <CheckCircle2 size={16} />
            Approve Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatusUpdateConfirmation;
