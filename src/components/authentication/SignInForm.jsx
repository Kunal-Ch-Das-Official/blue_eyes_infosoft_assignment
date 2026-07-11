import { BiLogInCircle } from "react-icons/bi";
import { Link } from "react-router-dom";
import EmailInput from "../../utils/form-inputs/EmailInput";
import PasswordInput from "../../utils/form-inputs/PasswordInput";
import ThemeBtn from "../../utils/buttons/ThemeBtn";

const SignInForm = ({
  setEmail,
  setPassword,
  setIsStrongPassword,
  isEmailNotValid,
  onsubmitHandler,
}) => {
  return (
    <div
      className="max-w-xl w-full mx-auto bg-white px-8 py-2 
    rounded-xl shadow shadow-slate-300 border border-gray-300"
    >
      <h1 className="text-2xl font-medium pt-4">Sign In</h1>
      <p className="text-slate-500 pt-2">
        Hi, Welcome back to sports club management admin dashboard 👋
      </p>

      <form className="my-6" onSubmit={onsubmitHandler}>
        <div className="flex flex-col">
          <div className="space-y-4">
            {/* Email field  */}
            <EmailInput
              inputLabel="Registered email address"
              defaultEmail={undefined}
              emailValue={setEmail}
              emailValidationError={isEmailNotValid}
              placeHolderText="yourmail@example.com"
              isRequired={true}
              fieldId="signIn"
            />

            {/* Password field  */}
            <PasswordInput
              serialId={"password"}
              inputId="signin_password"
              passwordLabel="Enter your password"
              inputValue={setPassword}
              setIsStrongPassword={setIsStrongPassword}
              validationError={undefined}
              errorMessage=""
            />
          </div>

          <div className="inline-flex justify-between items-center py-4">
            <div>
              {/* Forgot password link  */}
              <Link
                to={"/#"}
                className="font-medium text-sm hover:underline text-[#0f3670] underline"
              >
                Forgot Password?
              </Link>
            </div>
          </div>

          {/* Submit button  */}
          <ThemeBtn
            btnType="submit"
            handleBtnClick={undefined}
            btnText="Sign In"
            iconsLogo={<BiLogInCircle className="text-lg" />}
          />

          <div className="text-center text-base font-base inline-flex items-center w-full my-2">
            <p className="border-b border-gray-400 w-full"></p>
            <span className="mx-4 text-gray-500 font-medium">Or</span>
            <p className="border-b border-gray-400 w-full"></p>
          </div>
        </div>

        <div className="text-sm text-gray-500 font-medium mb-4 mt-4">
          Don't have admin account? To get access and
          <Link to={"/sign-up"} className="text-blue-800 underline ml-1">
            Sign up
          </Link>
        </div>
      </form>
    </div>
  );
};

export default SignInForm;
