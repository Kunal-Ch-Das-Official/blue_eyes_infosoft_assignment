import { memo, useRef } from "react";
import { obfuscateEmail } from "../../helpers/obfuscateEmail";

const OTPVerificationForm = ({
  headingText,
  recipientEmail,
  subHeadingText,
  buttonDynamicStyle,
  buttonText,
  otp,
  setOtp,
  handleVerifyBtnClick,
  onResendBtnClickHandler,
}) => {
  const inputRefs = useRef(Array(6).fill(null));

  // Key Down
  const handleKeyDown = (e, index) => {
    // Allow "Ctrl+V" and "Cmd+V"
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "v") {
      e.preventDefault();

      navigator.clipboard.readText().then((text) => {
        const clean = text.trim().replace(/[^0-9]/g, "");
        if (clean.length !== otp.length) return;

        setOtp(clean.split(""));
        inputRefs.current[otp.length - 1]?.focus();
      });

      return;
    }

    // Prevent non-numeric
    if (
      !/^[0-9]{1}$/.test(e.key) &&
      e.key !== "Backspace" &&
      e.key !== "Delete" &&
      e.key !== "Tab" &&
      !e.metaKey
    ) {
      e.preventDefault();
    }

    if (e.key === "Backspace" || e.key === "Delete") {
      e.preventDefault();

      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);

      if (index > 0) inputRefs.current[index - 1]?.focus();
    }
  };

  // Input
  const handleInput = (e, index) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    if (!value) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Focus
  const handleFocus = (e) => {
    e.target.select();
  };

  // Paste
  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text").replace(/[^0-9]/g, "");

    if (text.length !== otp.length) return;

    setOtp(text.split(""));
    inputRefs.current[otp.length - 1]?.focus();
  };

  return (
    <main className="flex justify-center items-center px-4 sm:px-6">
      <div className="w-full max-w-md px-5 py-10 mx-auto text-center bg-white sm:px-8 rounded-xl shadow relative border border-gray-200">
        {/* Header */}
        <header className="mb-8 mt-10 sm:mt-12">
          <p className="pb-2 text-sm">
            <span className="font-semibold text-green-800 mr-1">
              Sended on:
            </span>{" "}
            {obfuscateEmail(recipientEmail || "", {
              keepLocalFirstN: 2,
              keepLocalLastN: 3,
              maskChar: "*",
            })}
          </p>
          <h1 className="text-2xl font-bold mb-1">{headingText}</h1>
          <p className="text-[15px] text-slate-500">{subHeadingText}</p>
        </header>

        {/* OTP Inputs */}
        <form id="otp-form">
          <div className="flex items-center justify-center gap-2 sm:gap-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                className="w-10 h-10 sm:w-14 sm:h-14 text-center text-xl sm:text-2xl font-extrabold text-slate-900
                  bg-slate-100 border border-gray-300 hover:border-gray-500 rounded p-3 outline-none 
                  focus:bg-white focus:border-[#20618d] focus:ring-2 focus:ring-[#20618d]
                  transition-all"
                maxLength={1}
                value={digit}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onChange={(e) => handleInput(e, index)}
                onFocus={handleFocus}
                onPaste={handlePaste}
              />
            ))}
          </div>

          {/* Submit Button */}
          <div className="max-w-65 mx-auto mt-8">
            <button
              onClick={handleVerifyBtnClick}
              type="button"
              className={`w-full inline-flex justify-center whitespace-nowrap rounded-lg
                px-3.5 py-2.5 text-sm font-medium shadow-sm shadow-indigo-950/10
                ${buttonDynamicStyle} focus:outline-none focus:ring focus:ring-indigo-300
                transition-colors duration-150 cursor-pointer 
              `}
            >
              {buttonText}
            </button>
          </div>
        </form>

        {/* Resend */}
        <button
          onClick={onResendBtnClickHandler}
          className="text-sm text-slate-500 mt-6 inline-flex"
        >
          Didn’t receive code?
          <span className="font-medium text-[#0048a7d9] hover:text-[#3d208d] mx-2 cursor-pointer">
            Resend
          </span>
        </button>

        {/* Timer */}
        <div className="mt-2">
          <h6 className="text-sm text-gray-600 font-medium">
            OTP Expires in 5 min
          </h6>
        </div>
      </div>
    </main>
  );
};

export default memo(OTPVerificationForm);
