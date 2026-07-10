// Modern Option Component
import { ChevronDown } from "lucide-react";

const Option = ({
  label,
  value,
  onChange,
  placeholder,
  options,
  isRequired,
}) => {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
        {label}
        <span
          className={`text-rose-500 ${isRequired === true ? "visible" : "hidden"}`}
        >
          *
        </span>
      </label>

      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className="
            w-full appearance-none rounded-xl border border-gray-300 bg-white
            px-4 py-2.5 pr-10 text-sm text-gray-900 shadow-sm
            transition-all duration-200
            focus:outline-none
            focus:border-sky-400
            focus:ring-0
            focus:shadow-[0_0_0_3px_rgba(56,189,248,0.45)]
          "
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options &&
            options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
        </select>

        <ChevronDown
          className="
            pointer-events-none absolute right-3 top-1/2
            h-4 w-4 -translate-y-1/2 text-gray-400
          "
        />
      </div>
    </div>
  );
};

export default Option;
