import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import SignUpForm from "../components/forms/SignupForm";
import showWarningToastQueue from "../helpers/showWarningToastQueue";
import { primaryEmailSyntaxCheck } from "../helpers/primaryEmailSyntaxCheck";
import envConfig from "../config/env.conf";
import apiUrl from "../config/api.conf";
import { useSignUpDataStore } from "../stores/useSignUpDataStore";
import InternalErrorRes from "../utils/toast/InternalErrorRes";

const SignUp = () => {
  const {
    setFullNameGlobal,
    setEmailIdGlobal,
    setPasswordGlobal,
    setConfirmPasswordGlobal,
  } = useSignUpDataStore();
  const registerFormRef = useRef(null);
  const navigate = useNavigate();

  // 2. Full Name State ------
  const [fullName, setFullName] = useState("");

  // 3. Email Address State ------
  const [emailAddress, setEmailAddress] = useState("");
  const [isEmailNotValid, setIsEmailNotValid] = useState(false);

  //  4. Password State -----
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordNotValid, setIsPasswordNotValid] = useState(false);
  const [isStrongPassword, setIsStrongPassword] = useState(false);

  // Sign up handler
  const handleManualSignup = async (event) => {
    event.preventDefault();

    const errorMessage = {
      hasError: false,
      message: [],
    };

    // Reset all errors before validating
    setIsEmailNotValid(false);
    setIsPasswordNotValid(false);

    // 2. Full name must not be empty
    if (fullName.trim().length < 1) {
      errorMessage.hasError = true;
      errorMessage.message = [
        ...errorMessage.message,
        "Seems Name field is missing. Full name is require to proceed.",
      ];
    }

    // 3. Email syntax validation
    const isEmailSyntaxValid = primaryEmailSyntaxCheck(emailAddress);

    if (!isEmailSyntaxValid.ok) {
      setIsEmailNotValid(true);
      errorMessage.hasError = true;
      errorMessage.message = [
        ...errorMessage.message,
        "Seems email id syntax is invalid.",
      ];
    }

    // 4. Passwords match?
    if (password !== confirmPassword) {
      setIsPasswordNotValid(true);
      errorMessage.hasError = true;
      errorMessage.message = [
        ...errorMessage.message,
        "Seems email id syntax is invalid.",
      ];
    }

    // 5. Strong password?
    if (!isStrongPassword) {
      errorMessage.hasError = true;
      errorMessage.message = [
        ...errorMessage.message,
        "Given password is weak, provide a strong password.",
      ];
    }

    // If any error → stop
    if (errorMessage.hasError === true) {
      // Display error message
      await showWarningToastQueue(errorMessage.message);

      return;
    } else {
      // -------------------------
      // 🚀 ALL VALID → Submit Now
      // -------------------------
      try {
        const newRegistrationData = {
          fullName: fullName,
          emailId: emailAddress,
          password: password,
          confirmPassword: confirmPassword,
        };

        // send request to server (example)
        const response = await apiUrl.post(
          `${envConfig.NEW_USER_REGISTRATION_URL}`,
          newRegistrationData,
        );

        const data = response.data;

        if (!data) {
          toast.error(
            <div>
              <strong className="text-rose-600">Failed!</strong>
              <p className="text-xs text-gray-500">
                Unable to send otp on your given email address. Please check the
                email and try again.
              </p>
            </div>,
          );
        } else {
          setFullNameGlobal(fullName);
          setEmailIdGlobal(emailAddress);
          setPasswordGlobal(password);
          setConfirmPasswordGlobal(confirmPassword);
          navigate(`/verify-new-users-email/${emailAddress}`);
        }
      } catch (error) {
        InternalErrorRes(error);
      }
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#d8d8d8]">
      <SignUpForm
        setFullName={setFullName}
        registerFormRef={registerFormRef}
        setNewEmailAddress={setEmailAddress}
        setSignupPassword={setPassword}
        setSignupConfirmPassword={setConfirmPassword}
        setIsStrongPassword={setIsStrongPassword}
        isEmailNotValid={isEmailNotValid}
        isPasswordError={isPasswordNotValid}
        handleManualSignup={handleManualSignup}
      />
    </main>
  );
};

export default SignUp;
