import { BiLogInCircle } from "react-icons/bi";
import TextInput from "../../utils/form-inputs/TextInput";
import EmailInput from "../../utils/form-inputs/EmailInput";
import PasswordInput from "../../utils/form-inputs/PasswordInput";
import ThemeBtn from "../../utils/buttons/ThemeBtn";

const SignUpForm = ({
  setFullName,
  setNewEmailAddress,
  setSignupPassword,
  setSignupConfirmPassword,
  handleManualSignup,
  isEmailNotValid,
  isPasswordError,
  registerFormRef,
  setIsStrongPassword,
}) => {
  return (
    <section
      className="w-full max-w-2xl mx-auto bg-white px-8 py-2
     rounded-xl shadow shadow-slate-300 border border-gray-300"
    >
      <h1 className="text-2xl font-medium pt-4">New Registration</h1>
      <p className="text-slate-500 pt-2">
        Hi, Signup and get access of Sports Club's admin dashboard 👋
      </p>

      <form
        className="my-6"
        onSubmit={handleManualSignup}
        ref={registerFormRef}
      >
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col sm:flex-row w-full gap-2">
            {/* Full name fields */}
            <TextInput
              inputLabel="Full Name"
              defaultText={undefined}
              textValue={setFullName}
              placeHolderText="Enter your good name"
              isRequired={true}
              fieldId="register_new_fullname"
            />
          </div>

          <div className="pb-4 pt-1">
            <EmailInput
              inputLabel="Register new email address"
              defaultEmail={undefined}
              emailValue={setNewEmailAddress}
              emailValidationError={isEmailNotValid}
              placeHolderText="email.id@example.com"
              isRequired={true}
              fieldId="signUp"
            />
          </div>

          <div className="flex flex-col sm:flex-row w-full max-w-2xl gap-2">
            <PasswordInput
              serialId={"password"}
              inputId="signup_password"
              passwordLabel="Enter your new password"
              inputValue={setSignupPassword}
              setIsStrongPassword={setIsStrongPassword}
              validationError={isPasswordError}
              errorMessage="Seems password and confirm password is not same."
            />
            <PasswordInput
              serialId={"confirm_password"}
              inputId="signup_confirm_password"
              passwordLabel="Enter your confirm password"
              inputValue={setSignupConfirmPassword}
              setIsStrongPassword={setIsStrongPassword}
              validationError={isPasswordError}
              errorMessage="Seems password and confirm password is not same."
            />
          </div>

          <ThemeBtn
            btnType="submit"
            handleBtnClick={undefined}
            btnText="Sign Up"
            iconsLogo={<BiLogInCircle className="text-lg" />}
          />
        </div>
      </form>
    </section>
  );
};

export default SignUpForm;
