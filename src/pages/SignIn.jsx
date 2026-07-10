import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import InternalErrorRes from "../utils/toast/InternalErrorRes";
import { primaryEmailSyntaxCheck } from "../helpers/primaryEmailSyntaxCheck";
import envConfig from "../config/env.conf";
import SignInForm from "../components/forms/SignInForm";
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

  useEffect(() => {
    if (message) {
      toast.success(
        <div>
          <strong className="text-green-600">Successful!</strong>
          <p className="text-xs text-gray-800">{message}</p>
        </div>
      );

      // Clear the state so effect won't re-run
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [message, navigate, location.pathname]);

  const handleManualSignIn = async (
    event
  ) => {
    event.preventDefault();

    const errorMessage = {
      hasError: false,
      message: [],
    }
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
      try {
        const reqBody = {
          emailId: emailId,
          password: password,
        };

        apiUrl.defaults.withCredentials = true;

        const response = await apiUrl.post(envConfig.USER_LOGIN_URL, reqBody);

        if (!response.data) {
          toast.error(
            <div>
              <strong className="text-rose-600">Failed!</strong>
              <p className="text-xs text-gray-500">User is not verified</p>
            </div>
          );
        } else {
          navigate(`/portal`);
        }
      } catch (error) {
        InternalErrorRes(error);
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

      />
    </main>
  );
};

export default SignIn;