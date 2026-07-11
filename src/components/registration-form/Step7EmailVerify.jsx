import OTPVerificationForm from "../authentication/OtpVerificationForm";
import { useAthleteRegistrationStore } from "../../stores/useRegistrationStore";
import { useState } from "react";
import { athleteSchema } from "./NavigationButtons";
import { toast } from "react-toastify";
import apiUrl from "../../config/api.conf";
import envConfig from "../../config/env.conf";

const Step7EmailVerify = () => {
  // 1. Unified state extraction from Zustand
  const { emailAddress, nextStep } = useAthleteRegistrationStore();

  // 2. Local UI Interaction states
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);

  // 3. Handle OTP submission to finalize pipeline
  const handleOtpVerification = async () => {
    const enteredOtp = otp.join("").trim();

    if (enteredOtp.length !== 6) {
      toast.warning("Please enter all 6 digits of the OTP.");
      return;
    }

    setIsSubmitting(true);
    try {
      const dbResponse = await apiUrl.post(
        envConfig.PUSH_NEW_ATHLETE_DETAILS_TO_DB_URL,
        { verificationOtp: enteredOtp },
        { withCredentials: true },
      );

      if (!dbResponse || !dbResponse.data) {
        throw new Error(
          "Empty response body returned from DB pipeline gateway.",
        );
      }

      nextStep();
      toast.success(
        <div>
          <strong className="font-semibold text-green-600">Successful!</strong>
          <p className="text-xs text-gray-800">
            {dbResponse.data.details || "Details submitted successfully."}
          </p>
        </div>,
      );
    } catch (error) {
      console.error("OTP Verification runtime error:", error);
      toast.error(
        <div>
          <strong className="font-semibold text-rose-600">
            Verification Failed
          </strong>
          <p className="text-xs text-gray-800">
            {error.response?.data?.message ||
              error.message ||
              "An error occurred during verification."}
          </p>
        </div>,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // 4. Handle generating/resending registration token pipeline
  const handleSignUpOtpReSend = async () => {
    if (isSubmitting) return;

    setValidationErrors([]);
    const state = useAthleteRegistrationStore.getState();

    const payloadData = {
      playerName: state.playerName,
      fathersName: state.fathersName,
      mothersName: state.mothersName,
      dateOfBirth: state.dateOfBirth,
      gender: state.gender,
      emailAddress: state.emailAddress,
      contactNumber: state.contactNumber,
      alternateMobileNo: state.alternateMobileNo || "",
      address: state.address,
      pinCode: state.pinCode,
      stateOrProvince: state.stateOrProvince,
      country: state.country,
      club: state.club,
      sports: state.sports,
      fileTitles: state.fileTitles,
      competitions: state.competitions,
    };

    const validationResult = athleteSchema.safeParse(payloadData);
    if (!validationResult.success) {
      const errors = validationResult.error.errors.map(
        (err) => `${err.path.join(".")}: ${err.message}`,
      );
      setValidationErrors(errors);
      toast.error("Validation failed. Please review your entries.");
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();

    Object.keys(payloadData).forEach((key) => {
      if (
        key !== "competitions" &&
        key !== "fileTitles" &&
        payloadData[key] !== null &&
        payloadData[key] !== undefined
      ) {
        formData.append(key, payloadData[key]);
      }
    });

    if (state.profilePhoto) {
      formData.append("profile_photo", state.profilePhoto);
    }

    state.playerDocuments.forEach((file, index) => {
      if (file) {
        formData.append("players_document", file);
        formData.append(
          `fileTitles[${index}]`,
          state.fileTitles[index] || `Doc_${index}`,
        );
      }
    });

    formData.append(
      "competitions",
      JSON.stringify(payloadData.competitions || []),
    );

    try {
      const uploadResponse = await apiUrl.post(
        envConfig.POST_NEW_ATHLETE_DETAILS_URL,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      if (uploadResponse && uploadResponse.data) {
        toast.success(
          <div>
            <strong className="font-semibold text-green-600">
              OTP Resent!
            </strong>
            <p className="text-xs text-gray-700">
              {uploadResponse.data.details ||
                "A new code has been sent to your email."}
            </p>
          </div>,
        );
      } else {
        throw new Error("Empty payload response.");
      }
    } catch (error) {
      console.error("Critical submission runtime exception caught:", error);
      toast.error(
        <div>
          <strong className="font-semibold text-rose-600">
            Submission Failure
          </strong>
          <p className="text-xs text-gray-800">
            {error.response?.data?.message ||
              "Server communication error occurred."}
          </p>
        </div>,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-[50vh] w-full p-4">
      <div className="relative w-full">
        {isSubmitting && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center rounded-xl bg-white/70 backdrop-blur-sm transition-all duration-200">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#0f427d] border-t-transparent" />
            <p className="mt-3 text-sm font-medium text-gray-700 animate-pulse">
              Processing request...
            </p>
          </div>
        )}

        <OTPVerificationForm
          recipientEmail={emailAddress || "N/A"}
          headingText="Verify Your Email Address With OTP."
          subHeadingText="We have sent you a six-digit one-time password to your provided email address. Please enter it below to complete registration."
          buttonDynamicStyle={`bg-[#0f427d] text-white hover:bg-white hover:text-[#110f7d] border border-[#0f427d] transition-all ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
          buttonText={isSubmitting ? "Verifying..." : "Verify OTP"}
          otp={otp}
          setOtp={setOtp}
          handleVerifyBtnClick={handleOtpVerification}
          onResendBtnClickHandler={handleSignUpOtpReSend}
        />

        {validationErrors.length > 0 && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-left">
            <h4 className="text-xs font-bold text-red-700 uppercase tracking-wider mb-1">
              Pre-flight Validation Logs:
            </h4>
            <ul className="list-disc pl-4 text-[11px] text-red-600 space-y-0.5">
              {validationErrors.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </main>
  );
};

export default Step7EmailVerify;
