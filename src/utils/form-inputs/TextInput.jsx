const TextInput = ({
  inputLabel,
  defaultText,
  values,
  textValue,
  placeHolderText,
  isRequired,
  fieldId,
  inputRef,
}) => {
  return (
    <div className="w-full">
      <label
        htmlFor={fieldId}
        className="block mb-2 text-sm font-medium text-gray-600"
      >
        {inputLabel}
        {""}
        {isRequired === true && <span className="text-rose-500 ml-2">*</span>}
      </label>
      <input
        ref={inputRef}
        type="text"
        defaultValue={defaultText}
        name={fieldId}
        value={values}
        id={fieldId}
        className="bg-white border border-gray-300  text-gray-900
           rounded-lg focus:outline-none focus:shadow-sm focus:shadow-blue-300
            focus:border-blue-400 block w-full p-2 text-sm"
        placeholder={placeHolderText}
        required={isRequired}
        onChange={(e) => textValue(e.target.value)}
      />
    </div>
  );
};

export default TextInput;
