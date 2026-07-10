import { useState, useMemo } from "react";
import { IoEyeSharp, IoEyeOffSharp } from "react-icons/io5";

const PasswordInput = ({
  inputId,
  serialId,
  passwordLabel,
  inputValue,
  validationError,
  errorMessage,
  setIsStrongPassword,
}) => {
  const [eyeButton, setEyeButton] = useState (false);
  const [password, setPassword] = useState("")

  const handlePasswordOpenClose = () => {
    setEyeButton((prev) => !prev);
  };

  // -----------------------
  // Password Strength Logic
  // -----------------------
  const getPasswordStrength = (pass) => {
    let strengthScore = 0;

    if (pass.length >= 8) strengthScore++; // length
    if (/[A-Z]/.test(pass)) strengthScore++; // uppercase
    if (/[a-z]/.test(pass)) strengthScore++; // lowercase
    if (/[0-9]/.test(pass)) strengthScore++; // numbers
    if (/[^A-Za-z0-9]/.test(pass)) strengthScore++; // symbols

    if (strengthScore <= 2) return "weak";
    if (strengthScore === 3 || strengthScore === 4) return "medium";
    return "strong";
  };

  const strength = useMemo(() => getPasswordStrength(password), [password]);

  const strengthColor =
    strength === "weak"
      ? "text-rose-500"
      : strength === "medium"
        ? "text-yellow-600"
        : "text-green-600";

  const strengthBarColor =
    strength === "weak"
      ? "bg-rose-500"
      : strength === "medium"
        ? "bg-yellow-500"
        : "bg-green-500";

  if (strength === "strong") {
    setIsStrongPassword(true);
  } else {
    setIsStrongPassword(false);
  }

  return (
    <section className="w-full">
      <label
        htmlFor={inputId}
        className="block mb-2 text-sm font-medium text-slate-600"
      >
        {passwordLabel} <span className="text-rose-500 ml-2">*</span>
      </label>

      <div className="relative flex items-center">
        <input
          type={eyeButton ? "text" : "password"}
          name={inputId}
          id={inputId}
          autoComplete="on"
          placeholder="••••••••••••••"
          className={`bg-white border border-gray-300 text-gray-900
           rounded-lg 
           focus:outline-none focus:shadow-sm focus:shadow-blue-300
           focus:border-blue-400 
           block w-full p-2 text-sm
           ${
             validationError
               ? "border-rose-600 focus:border-rose-500 shadow-sm shadow-rose-300"
               : "border-gray-300"
           }`}
          required
          onChange={(e) => {
            setPassword(e.target.value);
            inputValue(e.target.value);
          }}
        />

        {eyeButton ? (
          <IoEyeOffSharp
            className="text-xl text-gray-600 absolute right-2 cursor-pointer bg-white w-8 rounded-full h-5"
            onClick={handlePasswordOpenClose}
          />
        ) : (
          <IoEyeSharp
            className="text-xl text-gray-600 absolute right-2 cursor-pointer bg-white w-8 rounded-full h-5"
            onClick={handlePasswordOpenClose}
          />
        )}
      </div>

      {/* Password Strength Indicator */}
      <div
        className={`h-8 overflow-hidden ${serialId === "confirm_password" && "hidden"}`}
      >
        {password.length > 0 && (
          <div className="mt-2">
            <div className="w-full h-0.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${strengthBarColor}`}
                style={{
                  width:
                    strength === "weak"
                      ? "33%"
                      : strength === "medium"
                        ? "66%"
                        : "100%",
                }}
              ></div>
            </div>

            <p className={`text-[10px] mt-1 font-medium ${strengthColor}`}>
              Password Strength: {strength[0].toUpperCase() + strength.slice(1)}
            </p>
          </div>
        )}
      </div>

      {validationError && (
        <p className="ml-1 mt-1 text-rose-500 font-sm text-xs my-0 py-0">
          {errorMessage}
        </p>
      )}
    </section>
  );
};

export default PasswordInput;
