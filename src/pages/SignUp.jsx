import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import SignUpForm from "../components/authentication/SignupForm";
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

  // State Management ------
  const [fullName, setFullName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [isEmailNotValid, setIsEmailNotValid] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordNotValid, setIsPasswordNotValid] = useState(false);
  const [isStrongPassword, setIsStrongPassword] = useState(false);

  // 1. Added loading state
  const [isLoading, setIsLoading] = useState(false);

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
        "Seems Name field is missing. Full name is required to proceed.",
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

    // 4. Passwords match? (Fixed copy-paste text bug here)
    if (password !== confirmPassword) {
      setIsPasswordNotValid(true);
      errorMessage.hasError = true;
      errorMessage.message = [
        ...errorMessage.message,
        "Passwords do not match. Please verify your entries.",
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

    // If any validation error → stop
    if (errorMessage.hasError === true) {
      await showWarningToastQueue(errorMessage.message);
      return;
    } else {
      // -------------------------
      // 🚀 ALL VALID → Submit Now
      // -------------------------
      setIsLoading(true); // 2. Trigger loading indicator

      try {
        const newRegistrationData = {
          fullName: fullName,
          emailId: emailAddress,
          password: password,
          confirmPassword: confirmPassword,
        };

        const response = await apiUrl.post(
          `${envConfig.NEW_ADMIN_REGISTRATION_URL}?role=ADMIN`,
          newRegistrationData,
        );

        const data = response.data;

        if (!data) {
          toast.error(
            <div>
              <strong className="text-rose-600">Failed!</strong>
              <p className="text-xs text-gray-500">
                Unable to send OTP to your given email address. Please check the
                email and try again.
              </p>
            </div>,
          );
        } else {
          setFullNameGlobal(fullName);
          setEmailIdGlobal(emailAddress);
          setPasswordGlobal(password);
          setConfirmPasswordGlobal(confirmPassword);

          toast.success("Registration initiated! Please verify your email.");
          navigate(`/verify-new-admin-email/${emailAddress}`);
        }
      } catch (error) {
        // 3. Improved error parsing to capture dynamic API messages (e.g., "Email already exists")
        const serverError =
          error.response?.data?.message ||
          error.message ||
          "An unexpected registration error occurred.";

        toast.error(
          <div>
            <strong className="text-rose-600">Registration Failed</strong>
            <p className="text-xs text-gray-500">{serverError}</p>
          </div>,
        );

        InternalErrorRes(error);
      } finally {
        // 4. Turn off loading state no matter what happens
        setIsLoading(false);
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
        isLoading={isLoading} // 5. Forward loading prop down to form UI
      />
    </main>
  );
};

export default SignUp;
