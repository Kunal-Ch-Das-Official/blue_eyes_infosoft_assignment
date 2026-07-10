import { useAthleteRegistrationStore } from "../../stores/useRegistrationStore";
import TextInput from "../../utils/form-inputs/TextInput";
import CountrySelect from "../../utils/form-inputs/CountrySelect";


const Step3Address = () => {
  const {
    address,
    pinCode,
    stateOrProvince,
    country,
    updateField,
  } = useAthleteRegistrationStore();

  return (
    <div className="space-y-6">
      {/* Step Heading */}
      <div className="border-b border-gray-100 pb-4">
        <h2 className="text-xl font-semibold text-gray-800">Address Details</h2>
        <p className="text-sm text-gray-500 mt-1">Provide your current residential or correspondence address location details.</p>
      </div>

      {/* Form Elements */}
      <div className="flex flex-col gap-6">
        {/* Address Row (Full Width Area) */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="address" className="text-sm font-medium text-gray-700">
            Street Address <span className="text-rose-500">*</span>
          </label>
          <textarea
            id="address"
            name="address"
            rows="3"
            value={address}
            placeholder="Enter flat, house no., building, street area details"
            required={true}
            onChange={(e) => updateField('address', e.target.value)}
            className="
              w-full rounded-xl border border-gray-300 bg-white
              px-4 py-2.5 text-sm text-gray-900 shadow-sm
              transition-all duration-200 outline-none
              focus:border-sky-400 focus:ring-0
              focus:shadow-[0_0_0_3px_rgba(56,189,248,0.45)]
            "
          />
        </div>

        {/* Location Specific Fields Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <TextInput
            inputLabel="Pin / Postal Code"
            fieldId="pinCode"
            values={pinCode}
            placeHolderText="e.g., 700001"
            isRequired={true}
            textValue={(val) => updateField('pinCode', val)}
          />

          <TextInput
            inputLabel="State / Province"
            fieldId="stateOrProvince"
            values={stateOrProvince}
            placeHolderText="Enter state name"
            isRequired={true}
            textValue={(val) => updateField('stateOrProvince', val)}
          />

          <CountrySelect
            label="Country"
            value={country}
            placeholder="Select country"
            isRequired={true}
            onChange={(val) => updateField('country', val)}
          />
        </div>
      </div>
    </div>
  );
};

export default Step3Address;