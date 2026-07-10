import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useSignUpDataStore } from "../stores/useSignUpDataStore";
import apiUrl from "../config/api.conf";
import envConfig from "../config/env.conf";
import InternalErrorRes from "../utils/toast/InternalErrorRes";
import OtpVerificationForm from "../components/forms/OtpVerificationForm";
import Notice from "../utils/modals/Notice";

const NewUsersEmailVerification = () => {
  const navigate = useNavigate();
  const { fullName, email, password, confirmPassword } = useSignUpDataStore();
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [popupOpen, setPopUpOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { emailId } = useParams();

  // OTP Verification
  const handleOtpVerification = async () => {
    const convertedOtp = otp.join("");
    const confirmationCode = parseInt(convertedOtp);
    const reqBody = {
      oneTimePassword: confirmationCode,
    };
    try {
      const response = await apiUrl.post(
        envConfig.NEW_USER_EMAIL_VERIFICATION_URL,
        reqBody,
      );
      if (response.data) {
        setIsSuccess(true);
      } else {
        toast.error(
          <div>
            <strong className="text-rose-600">Failed!</strong>
            <p className="text-xs text-gray-500">
              An unexpected error occurred, Please try again.
            </p>
          </div>,
        );
      }
    } catch (error) {
      InternalErrorRes(error);
    } finally {
      setPopUpOpen(true);
    }
  };

  // Re-Send OTP
  const handleSignUpOtpReSend = async () => {
    if (!fullName || !emailId || !password || !confirmPassword) {
      toast.error(
        <div>
          <strong className="text-rose-600">Failed!</strong>
          <p className="text-xs text-gray-500">
            Something went wrong, Some provided field got lost. Please do
            register again.
          </p>
        </div>,
      );
    } else {
      try {
        const newRegistrationData = {
          fullName: fullName,
          emailId: email,
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
          toast.success(
            <div>
              <strong className="text-green-600">Successful!</strong>
              <p className="text-xs text-gray-700">
                Six digit otp has been sended to your email address.
              </p>
            </div>,
          );
        }
      } catch (error) {
        InternalErrorRes(error);
      }
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#d8d8d8]">
      <OtpVerificationForm
        recipientEmail={!emailId ? email : emailId}
        headingText="Verify Your Email Address With OTP."
        subHeadingText="We have send you a six digit one time password to your provided email address. Please confirm that you get register."
        buttonDynamicStyle="bg-[#0f427d] text-white hover:bg-white hover:text-[#110f7d] border border-[#0f427d]"
        buttonText="Verify OTP"
        otp={otp}
        setOtp={setOtp}
        handleVerifyBtnClick={handleOtpVerification}
        onResendBtnClickHandler={handleSignUpOtpReSend}
      />

      {popupOpen && (
        <>
          {isSuccess ? (
            <Notice
              popupTitle="Account Has Been Created Successfully!"
              popupDetails="Please sign in for active your new account."
              mountUnmount={popupOpen}
              setMountUnmount={() => {
                setPopUpOpen(false);
                navigate("/sign-in");
              }}
              closeBtnColor="bg-white border-green-500 border rounded-lg text-green-500 hover:text-white hover:bg-green-500 cursor-pointer"
              closeBtnText="Login"
            />
          ) : (
            <Notice
              popupTitle="OTP Verification Failed!"
              popupDetails="Please provide a valid otp. Provided otp and expected otp is not same"
              mountUnmount={true}
              setMountUnmount={() => navigate(-1)}
              closeBtnColor="bg-white border-rose-500 border rounded-lg text-rose-500 hover:text-white hover:bg-rose-500 cursor-pointer"
              closeBtnText="Try again"
            />
          )}
        </>
      )}
    </main>
  );
};

export default NewUsersEmailVerification;
