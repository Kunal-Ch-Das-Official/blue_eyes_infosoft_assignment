import { useAthleteRegistrationStore } from "../stores/useRegistrationStore";
import ProgressBar from "../components/registration-form/ProgressBar";

// Step Components
import Step1Personal from "../components/registration-form/Step1Personal";
import Step2Guardian from "../components/registration-form/Step2Guardian";
import Step3Address from "../components/registration-form/Step3Address";
import Step4Sports from "../components/registration-form/Step4Sports";
import Step5Documents from "../components/registration-form/Step5Documents";
import Step6Review from "../components/registration-form/Step6Review";
import NavigationButtons from "../components/registration-form/NavigationButtons";
import Step7EmailVerify from "../components/registration-form/Step7EmailVerify";

const AthleteRegistration = () => {
  const currentStep = useAthleteRegistrationStore((state) => state.currentStep);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1Personal />;
      case 2:
        return <Step2Guardian />;
      case 3:
        return <Step3Address />;
      case 4:
        return <Step4Sports />;
      case 5:
        return <Step5Documents />;
      case 6:
        return <Step6Review />;
      case 7:
        return <Step7EmailVerify />;
      case 8:
        return (
          <div className="text-center py-8">
            <h2 className="text-2xl font-bold text-green-600 mb-2">
              Registration Complete!
            </h2>
            <p className="text-slate-600">
              Your application has been submitted successfully.
            </p>
          </div>
        );
      default:
        return <Step1Personal />;
    }
  };

  return (
    <div className="min-h-screen mt-20 bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden border border-slate-100">
        {/* Header Section */}
        <div className="bg-slate-900 px-8 py-6 text-white">
          <h1 className="text-2xl font-bold tracking-tight">
            Athlete Registration
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Please complete all steps to register your profile.
          </p>
        </div>

        {/* Progress Tracker */}
        <div className="px-6 pt-6">
          <ProgressBar />
        </div>

        {/* Dynamic Form Content */}
        <div className="px-8 py-6 min-h-100">{renderStep()}</div>

        {/* Action Persistent Navigation (Hidden on final step) */}
        {currentStep < 7 && (
          <div className="px-8 py-4 bg-slate-50 border-t border-slate-100">
            <NavigationButtons />
          </div>
        )}
      </div>
    </div>
  );
};

export default AthleteRegistration;
