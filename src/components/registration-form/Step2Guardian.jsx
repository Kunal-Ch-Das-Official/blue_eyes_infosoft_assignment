import { useAthleteRegistrationStore } from "../../stores/useRegistrationStore";
import { useState } from "react";
import TextInput from "../../utils/form-inputs/TextInput";
import MobileInput from "../../utils/form-inputs/MobileInput";

const Step2Guardian = () => {
  const { fathersName, mothersName, alternateMobileNo, updateField } =
    useAthleteRegistrationStore();

  // Local state for alternate mobile validation
  const [alternateMobileError, setAlternateMobileError] = useState(false);

  const handleMobileChange = (val) => {
    updateField("alternateMobileNo", val);
    if (val.length > 0) {
      const phoneRegex = /^\d{10}$/; // Validates basic 10-digit formats
      setAlternateMobileError(!phoneRegex.test(val));
    } else {
      setAlternateMobileError(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Step Heading */}
      <div className="border-b border-gray-100 pb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Guardian Details
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Provide parental information and alternate contact metrics details.
        </p>
      </div>

      {/* Form Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TextInput
          inputLabel="Father's Name"
          fieldId="fathersName"
          values={fathersName}
          placeHolderText="Enter father's full name"
          isRequired={true}
          textValue={(val) => updateField("fathersName", val)}
        />

        <TextInput
          inputLabel="Mother's Name"
          fieldId="mothersName"
          values={mothersName}
          placeHolderText="Enter mother's full name"
          isRequired={true}
          textValue={(val) => updateField("mothersName", val)}
        />

        <MobileInput
          inputLabel="Alternate Mobile Number"
          fieldId="alternateMobileNo"
          defaultMobile={alternateMobileNo}
          mobileValue={handleMobileChange}
          mobileValidationError={alternateMobileError}
          placeHolderText="Enter secondary 10-digit number"
          isRequired={false}
        />
      </div>
    </div>
  );
};

export default Step2Guardian;
