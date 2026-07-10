import { useState } from "react";
import { useAthleteRegistrationStore } from "../../stores/useRegistrationStore";
import DatePickerInput from "../../utils/form-inputs/DatePickerInput";
import Option from "../../utils/form-inputs/Option";
import TextInput from "../../utils/form-inputs/TextInput";
import EmailInput from "../../utils/form-inputs/EmailInput";
import MobileInput from "../../utils/form-inputs/MobileInput";

const Step1Personal = () => {
  const {
    playerName,
    emailAddress,
    contactNumber,
    dateOfBirth,
    gender,
    updateField,
  } = useAthleteRegistrationStore();

  // Local state for handling component error displays
  const [emailError, setEmailError] = useState(false);
  const [mobileError, setMobileError] = useState(false);

  const genderOptions = [
    { label: "MALE", value: "MALE" },
    { label: "FEMALE", value: "FEMALE" },
    { label: "OTHERS", value: "OTHERS" },
  ];

  // Helper validation functions
  const handleEmailChange = (val) => {
    updateField("emailAddress", val);
    if (val.length > 0) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setEmailError(!emailRegex.test(val));
    } else {
      setEmailError(false);
    }
  };

  const handleMobileChange = (val) => {
    updateField("contactNumber", val);
    if (val.length > 0) {
      const phoneRegex = /^\d{10}$/; // Assumes standard 10 digit number configuration
      setMobileError(!phoneRegex.test(val));
    } else {
      setMobileError(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Step Heading */}
      <div className="border-b border-gray-100 pb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Personal Details
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Provide your core identification and primary contact details.
        </p>
      </div>

      {/* Form Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TextInput
          inputLabel="Player Name"
          fieldId="playerName"
          values={playerName}
          placeHolderText="Enter full name"
          isRequired={true}
          textValue={(val) => updateField("playerName", val)}
        />

        <DatePickerInput
          inputLabel="Date of Birth"
          fieldId="dateOfBirth"
          value={dateOfBirth ? new Date(dateOfBirth) : null}
          placeholder="Select Date of Birth"
          isRequired={true}
          onChange={(date) =>
            updateField("dateOfBirth", date ? date.toISOString() : "")
          }
        />

        <Option
          label="Gender"
          value={gender}
          placeholder="Select Gender"
          options={genderOptions}
          isRequired={true}
          onChange={(val) => updateField("gender", val)}
        />

        <EmailInput
          inputLabel="Email Address"
          fieldId="emailAddress"
          defaultEmail={emailAddress}
          emailValue={handleEmailChange}
          emailValidationError={emailError}
          placeHolderText="name@example.com"
          isRequired={true}
        />

        <MobileInput
          inputLabel="Contact Number"
          fieldId="contactNumber"
          defaultMobile={contactNumber}
          mobileValue={handleMobileChange}
          mobileValidationError={mobileError}
          placeHolderText="Enter 10-digit number"
          isRequired={true}
        />
      </div>
    </div>
  );
};

export default Step1Personal;
