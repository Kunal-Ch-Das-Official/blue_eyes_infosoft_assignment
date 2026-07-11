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

  // 1. Loading State ------
  const [isLoading, setIsLoading] = useState(false);

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

    // Prevent double submissions if already loading
    if (isLoading) return;

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

    // 4. Passwords match?
    if (password !== confirmPassword) {
      setIsPasswordNotValid(true);
      errorMessage.hasError = true;
      errorMessage.message = [
        ...errorMessage.message,
        "Passwords do not match.", // Fixed the copy-paste typo from original snippet
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

    // If any client-side error → stop
    if (errorMessage.hasError === true) {
      await showWarningToastQueue(errorMessage.message);
      return;
    }

    // -------------------------
    // 🚀 ALL VALID → Submit Now
    // -------------------------
    try {
      setIsLoading(true); // Start loading indicator

      const newRegistrationData = {
        fullName: fullName,
        emailId: emailAddress,
        password: password,
        confirmPassword: confirmPassword,
      };

      // send request to server
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
        navigate(`/verify-new-users-email/${emailAddress}`);
      }
    } catch (error) {
      // --- BACKEND ERROR HANDLING ---
      // Check if the server returned a specific error message (e.g., "Email already exists")
      const backendMessage =
        error?.response?.data?.details ||
        error?.message ||
        "Something went wrong please try again later.";

      toast.error(
        <div>
          <strong className="text-rose-600">
            {error?.response?.data?.message || "Registration Error"}{" "}
          </strong>
          <p className="text-xs text-gray-500">
            {backendMessage ||
              "Something went wrong while creating your account."}
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
        isLoading={isLoading} // Passed down so the submit button can show a spinner/disable state
      />
    </main>
  );
};

export default SignUp;
