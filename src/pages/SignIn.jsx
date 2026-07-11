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

  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [isStrongPassword, setIsStrongPassword] = useState(false);
  const [isEmailNotValid, setIsEmailNotValid] = useState(false);
  // 1. Added loading state
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (message) {
      toast.success(
        <div>
          <strong className="text-green-600">Successful!</strong>
          <p className="text-xs text-gray-800">{message}</p>
        </div>,
      );
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [message, navigate, location.pathname]);

  const handleManualSignIn = async (event) => {
    event.preventDefault();

    const errorMessage = {
      hasError: false,
      message: [],
    };

    if (!isStrongPassword) {
      errorMessage.hasError = true;
      errorMessage.message = [
        ...errorMessage.message,
        "Password is not strong, please provide a strong password.",
      ];
    }

    const isEmailSyntaxValid = primaryEmailSyntaxCheck(emailId);
    if (!isEmailSyntaxValid) {
      setIsEmailNotValid(true);
      errorMessage.hasError = true;
      errorMessage.message = [
        ...errorMessage.message,
        "Seems email syntax is invalid. Please check the credential and try again",
      ];
    }

    if (errorMessage.hasError === true) {
      await showWarningToastQueue(errorMessage.message);
    } else {
      // 2. Start loading before making the API request
      setIsLoading(true);

      try {
        const reqBody = {
          emailId: emailId,
          password: password,
        };

        apiUrl.defaults.withCredentials = true;

        const response = await apiUrl.post(
          `${envConfig.EXISTING_ADMIN_LOGIN_URL}?role=ADMIN`,
          reqBody,
        );

        if (response.data.message === "Successful!") {
          toast.success(
            <div>
              <strong className="text-green-600">Login Successful!</strong>
              <p className="text-xs text-gray-500">
                {response.data.details || "Welcome back!"}
              </p>
            </div>,
          );
          navigate("/dashboard");
        } else {
          // Fallback if status is 200 but message is not "Successful!"
          toast.error(
            <div>
              <strong className="text-rose-600">Failed!</strong>
              <p className="text-xs text-gray-500">
                {response.data.message || "User is not verified"}
              </p>
            </div>,
          );
          setIsLoading(false);
        }
      } catch (error) {
        // 3. Improved error feedback: Extract error message from server response if available
        const serverError =
          error.response?.data?.message ||
          error.message ||
          "An unexpected error occurred.";

        toast.error(
          <div>
            <strong className="text-rose-600">Login Failed</strong>
            <p className="text-xs text-gray-500">{serverError}</p>
          </div>,
        );

        // Keep your original catch-all utility if it handles other side effects
        InternalErrorRes(error);
      } finally {
        // 4. Always turn off loading state when done (unless navigated away)
        setIsLoading(false);
      }
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
        isLoading={isLoading} // 5. Pass the loading state down to the form component
      />
    </main>
  );
};

export default SignIn;
