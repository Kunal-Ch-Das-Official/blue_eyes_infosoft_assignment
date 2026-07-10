import { useAthleteRegistrationStore } from "../../stores/useRegistrationStore";


const steps = [
  { id: 1, label: 'Personal' },
  { id: 2, label: 'Guardian' },
  { id: 3, label: 'Address' },
  { id: 4, label: 'Sports' },
  { id: 5, label: 'Documents' },
  { id: 6, label: 'Review' },
  { id: 7, label: 'Mail Verify?' },
  { id: 8, label: 'Done' },
];

const ProgressBar = () => {
  const currentStep = useAthleteRegistrationStore((state) => state.currentStep);

  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between relative">
        {/* Background Line */}
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-slate-200 -z-10" />
        
        {/* Dynamic Progress Fill */}
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-blue-600 transition-all duration-300 -z-10"
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step) => {
          const isCompleted = currentStep > step.id;
          const isActive = currentStep === step.id;

          return (
            <div key={step.id} className="flex flex-col items-center flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 ${
                  isCompleted
                    ? 'bg-blue-600 text-white'
                    : isActive
                    ? 'bg-slate-900 text-white ring-4 ring-blue-100'
                    : 'bg-white text-slate-400 border-2 border-slate-200'
                }`}
              >
                {isCompleted ? '✓' : step.id}
              </div>
              <span
                className={`text-xs mt-2 font-medium hidden sm:block ${
                  isActive ? 'text-slate-900 font-semibold' : 'text-slate-400'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressBar;