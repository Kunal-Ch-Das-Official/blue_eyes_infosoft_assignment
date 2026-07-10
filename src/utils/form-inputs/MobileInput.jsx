

const MobileInput = ({
  inputLabel,
  defaultMobile,
  mobileValue,
  mobileValidationError,
  placeHolderText,
  isRequired,
  fieldId,
}) => {
  return (
    <section>
      <label
        htmlFor={fieldId}
        className="block mb-2 text-sm font-medium text-slate-600"
      >
        {inputLabel}
        {""}
        {isRequired === true && <span className="text-rose-500 ml-2">*</span>}
      </label>
      <input
        type="tel"
        defaultValue={defaultMobile}
        name={fieldId}
        id={fieldId}
        autoComplete="tel"
        className={`bg-white border ${
          mobileValidationError === true
            ? "border-rose-500 focus:border-rose-500 shadow-sm shadow-rose-300"
            : "border-gray-300"
        } text-gray-900 rounded-lg focus:outline-none focus:shadow-sm focus:shadow-blue-300
            focus:border-blue-400 
        block w-full p-2 text-sm`}
        placeholder={placeHolderText}
        required={isRequired}
        onChange={(e) => mobileValue(e.target.value)}
      />
      {mobileValidationError === true && (
        <p className="ml-1 mt-1 text-rose-500 font-sm text-xs my-0 py-0">
          Seems mobile number is invalid.
        </p>
      )}
    </section>
  );
};

export default MobileInput;