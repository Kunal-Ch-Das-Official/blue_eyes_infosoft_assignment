const TextArea = ({
  textareaLabel,
  defaultText,
  onChange,
  placeHolderText,
  isRequired,
  fieldId,
}) => {
  return (
    <div className="my-1">
      <label
        htmlFor={fieldId}
        className="block mb-2 text-sm font-medium text-gray-600"
      >
        {textareaLabel}
        {""}
        {isRequired === true && <span className="text-rose-500 ml-2">*</span>}
      </label>
      <textarea
        rows={4}
        defaultValue={defaultText}
        name={fieldId}
        id={fieldId}
        className="bg-white border border-[#dadada] shadow shadow-green-100 text-gray-900
           rounded-lg focus:outline-none focus:border-blue-500 focus:shadow
            focus:shadow-blue-300 block w-full p-2 text-sm"
        placeholder={placeHolderText}
        required={isRequired}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default TextArea;
