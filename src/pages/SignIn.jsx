import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import InternalErrorRes from "../utils/toast/InternalErrorRes";
import { primaryEmailSyntaxCheck } from "../helpers/primaryEmailSyntaxCheck";
import envConfig from "../config/env.conf";
import SignInForm from "../components/authentication/SignInForm";
import showWarningToastQueue from "../helpers/showWarningToastQueue";
import apiUrl from "../config/api.conf";

const SignIn = () => {
  const location = useLocation();
  const message = location.state?.message;
  const navigate = useNavigate();

  // States
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [isStrongPassword, setIsStrongPassword] = useState(false);
  const [isEmailNotValid, setIsEmailNotValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Added loading state

  useEffect(() => {
    if (message) {
      toast.success(
        <div>
          <strong className="text-green-600">Successful!</strong>
          <p className="text-xs text-gray-800">{message}</p>
        </div>,
      );

      // Clear the state so effect won't re-run
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [message, navigate, location.pathname]);

  const handleManualSignIn = async (event) => {
    event.preventDefault();

    // Prevent double submissions while loading
    if (isLoading) return;

    const errorMessage = {
      hasError: false,
      message: [],
    };

    // Reset email validation state before checking
    setIsEmailNotValid(false);

    if (!isStrongPassword) {
      errorMessage.hasError = true;
      errorMessage.message = [
        ...errorMessage.message,
        "Password is not strong, please provide a strong password.",
      ];
    }

    const isEmailSyntaxValid = primaryEmailSyntaxCheck(emailId);

    // FIXED: primaryEmailSyntaxCheck likely returns an object (e.g., { ok: false }) based on your SignUp file.
    if (!isEmailSyntaxValid || isEmailSyntaxValid.ok === false) {
      setIsEmailNotValid(true);
      errorMessage.hasError = true;
      errorMessage.message = [
        ...errorMessage.message,
        "Seems email syntax is invalid. Please check the credential and try again.",
      ];
    }

    if (errorMessage.hasError === true) {
      await showWarningToastQueue(errorMessage.message);
      return;
    }

    try {
      setIsLoading(true); // Start loading indicator

      const reqBody = {
        emailId: emailId,
        password: password,
      };

      apiUrl.defaults.withCredentials = true;

      const response = await apiUrl.post(
        envConfig.EXISTING_USER_LOGIN_URL,
        reqBody,
      );

      if (response.data.message === "Successful!") {
        toast.success(
          <div>
            <strong className="text-green-600">Login Successful!</strong>
            <p className="text-xs text-gray-500">{response.data.details}</p>
          </div>,
        );
        navigate("/home");
      } else {
        // Fallback fallback if status 200 is returned but it indicates a rejection/unverified status
        toast.error(
          <div>
            <strong className="text-rose-600">Authentication Failed</strong>
            <p className="text-xs text-gray-500">
              {response.data.details || "User is not verified."}
            </p>
          </div>,
        );
      }
    } catch (error) {
      // --- BACKEND ERROR HANDLING ---
      // Extracts specific messages from backend responses (e.g., "Invalid Credentials", "User not found")
      const backendMessage =
        error?.response?.data?.message ||
        error?.response?.data?.details ||
        error?.message;

      toast.error(
        <div>
          <strong className="text-rose-600">Login Failed</strong>
          <p className="text-xs text-gray-500">
            {backendMessage || "Invalid email or password. Please try again."}
          </p>
        </div>,
      );

      // Keep your fallback internal error layout utility if needed
      InternalErrorRes(error);
    } finally {
      setIsLoading(false); // Stop loading indicator regardless of success or failure
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#d8d8d8]">
      <SignInForm
        setEmail={setEmailId}
        setPassword={setPassword}
        setIsStrongPassword={setIsStrongPassword}
        onsubmitHandler={handleManualSignIn}
        isEmailNotValid={isEmailNotValid}
        isLoading={isLoading} // Pass loading status to handle disabled submission/spinners
      />
    </main>
  );
};

export default SignIn;
