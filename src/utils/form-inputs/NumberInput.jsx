const NumberInput = ({
  inputLabel,
  defaultNumber,
  number,
  numberValue,
  placeHolderText,
  isRequired,
  fieldId,
  customClasses,
}) => {
  // Prevent Arrow Up/Down keys
  const handleKeyDown = (e) => {
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
    }
  };

  return (
    <div className="my-1">
      <label
        htmlFor={fieldId}
        className={`block mb-2 text-sm font-medium text-gray-600 ${customClasses}`}
      >
        {inputLabel}
        {isRequired === true && <span className="text-rose-500 ml-2">*</span>}
      </label>
      <input
        type="number"
        min={0}
        step="any"
        defaultValue={Number(defaultNumber).toFixed(2)}
        value={number}
        name={fieldId}
        id={fieldId}
        // Combined Tailwind classes and "appearance-none" logic
        className={`bg-white border border-gray-300 text-gray-900
          rounded-lg focus:outline-none focus:border-blue-500 focus:shadow
          focus:shadow-blue-300 block w-full p-2 text-sm 
          [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
        placeholder={placeHolderText}
        required={isRequired}
        onChange={(e) => numberValue(Number(e.target.value))}
        // 1. Disable Mouse Wheel
        onWheel={(e) => e.target.blur()}
        // 2. Disable Arrow Keys
        onKeyDown={handleKeyDown}
      />
    </div>
  );
};

export default NumberInput;
