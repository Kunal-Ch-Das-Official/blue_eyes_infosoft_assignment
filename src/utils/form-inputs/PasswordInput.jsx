import { useState, useMemo, useEffect, useCallback } from "react";
import { IoEyeSharp, IoEyeOffSharp } from "react-icons/io5";

const PasswordInput = ({
  inputId,
  serialId,
  passwordLabel,
  inputValue,
  validationError = false,
  errorMessage = "",
  setIsStrongPassword,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  // -----------------------
  // Password Strength Logic
  // -----------------------
  const getPasswordStrength = useCallback((pass) => {
    let score = 0;

    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[a-z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    if (score <= 2) return "weak";
    if (score <= 4) return "medium";
    return "strong";
  }, []);

  const strength = useMemo(
    () => getPasswordStrength(password),
    [password, getPasswordStrength],
  );

  // Notify parent when strength changes
  useEffect(() => {
    if (typeof setIsStrongPassword === "function") {
      setIsStrongPassword(strength === "strong");
    }
  }, [strength, setIsStrongPassword]);

  const strengthColor = {
    weak: "text-rose-500",
    medium: "text-yellow-600",
    strong: "text-green-600",
  };

  const strengthBarColor = {
    weak: "bg-rose-500",
    medium: "bg-yellow-500",
    strong: "bg-green-500",
  };

  const strengthBarWidth = {
    weak: "33%",
    medium: "66%",
    strong: "100%",
  };

  const handleChange = (e) => {
    const value = e.target.value;

    setPassword(value);

    if (typeof inputValue === "function") {
      inputValue(value);
    }
  };

  return (
    <section className="w-full">
      <label
        htmlFor={inputId}
        className="block mb-2 text-sm font-medium text-slate-600"
      >
        {passwordLabel}
        <span className="ml-2 text-rose-500">*</span>
      </label>

      <div className="relative flex items-center">
        <input
          id={inputId}
          name={inputId}
          type={showPassword ? "text" : "password"}
          autoComplete="on"
          placeholder="••••••••••••••"
          required
          onChange={handleChange}
          className={`block w-full rounded-lg border p-2 text-sm text-gray-900
            focus:outline-none focus:border-blue-400 focus:shadow-sm focus:shadow-blue-300
            ${
              validationError
                ? "border-rose-600 shadow-sm shadow-rose-300 focus:border-rose-500"
                : "border-gray-300"
            }`}
        />

        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute right-2 flex items-center justify-center w-8 h-8 text-gray-600 hover:text-black"
        >
          {showPassword ? (
            <IoEyeOffSharp className="text-xl" />
          ) : (
            <IoEyeSharp className="text-xl" />
          )}
        </button>
      </div>

      {/* Password Strength */}
      {serialId !== "confirm_password" && password.length > 0 && (
        <div className="mt-2">
          <div className="w-full h-1 overflow-hidden rounded-full bg-gray-200">
            <div
              className={`h-full transition-all duration-300 ${strengthBarColor[strength]}`}
              style={{
                width: strengthBarWidth[strength],
              }}
            />
          </div>

          <p
            className={`mt-1 text-[10px] font-medium ${strengthColor[strength]}`}
          >
            Password Strength:{" "}
            {strength.charAt(0).toUpperCase() + strength.slice(1)}
          </p>
        </div>
      )}

      {validationError && (
        <p className="mt-1 ml-1 text-xs text-rose-500">{errorMessage}</p>
      )}
    </section>
  );
};

export default PasswordInput;
