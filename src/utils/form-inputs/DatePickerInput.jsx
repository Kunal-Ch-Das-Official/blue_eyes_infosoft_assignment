import { useRef, useState, useEffect } from "react";

// type DatePickerProps = {
//   inputLabel: string;
//   fieldId: string;
//   isRequired?: boolean;
//   placeholder?: string;
//   value?: Date | null;
//   onChange: (date: Date | null) => void;
// };

const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const YEARS = Array.from(
  { length: 40 },
  (_, i) => new Date().getFullYear() - 20 + i,
);

const formatDate = (date) =>
  `${String(date.getDate()).padStart(2, "0")}-${String(
    date.getMonth() + 1,
  ).padStart(2, "0")}-${date.getFullYear()}`;

// const parseDate = (val: string): Date | null => {
//   const [dd, mm, yyyy] = val.split("-").map(Number);
//   if (!dd || !mm || !yyyy) return null;
//   const parsed = new Date(yyyy, mm - 1, dd);
//   return isNaN(parsed.getTime()) ? null : parsed;
// };

const DatePickerInput = ({
  inputLabel,
  fieldId,
  isRequired,
  placeholder = "DD-MM-YYYY",
  value,
  onChange,
}) => {
  const [open, setOpen] = useState(false);
  const [currentMonth, setCurrentMonth] =
    useState < Date > (value ?? new Date());
  const wrapperRef = useRef < HTMLDivElement > null;

  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const inputValue = value ? formatDate(value) : "";
  const startOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1,
  );
  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0,
  ).getDate();
  const startDay = startOfMonth.getDay();

  const isSameDay = (d1, d2) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  const isToday = (date) => isSameDay(date, new Date());

  const changeMonth = (offset) => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + offset, 1),
    );
  };

  return (
    <div className="w-full font-sans" ref={wrapperRef}>
      <label
        htmlFor={fieldId}
        className="block mb-1.5 text-sm font-semibold text-gray-700 ml-1"
      >
        {inputLabel}
        {isRequired && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="relative group">
        <input
          id={fieldId}
          type="text"
          readOnly
          onClick={() => setOpen(!open)}
          value={inputValue}
          placeholder={placeholder}
          className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 pr-11 text-sm 
                     text-gray-800 cursor-pointer transition-all duration-200
                     hover:border-blue-400 focus:ring-4 focus:ring-blue-50/50 focus:border-blue-500 outline-none"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-blue-500 transition-colors">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
            <line x1="16" x2="16" y1="2" y2="6" />
            <line x1="8" x2="8" y1="2" y2="6" />
            <line x1="3" x2="21" y1="10" y2="10" />
          </svg>
        </div>

        {open && (
          <div className="absolute z-50 mt-3 w-full cursor-pointer bg-white border border-gray-100 rounded-2xl shadow-2xl p-4 animate-in fade-in zoom-in duration-200">
            {/* Header Controls */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => changeMonth(-1)}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-600 cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </button>

              <div className="flex gap-1">
                <select
                  value={currentMonth.getMonth()}
                  onChange={(e) =>
                    setCurrentMonth(
                      new Date(
                        currentMonth.getFullYear(),
                        Number(e.target.value),
                        1,
                      ),
                    )
                  }
                  className="bg-transparent font-bold text-gray-700 text-sm hover:text-blue-600 cursor-pointer outline-none appearance-none px-1"
                >
                  {MONTHS.map((m, i) => (
                    <option key={m} value={i}>
                      {m}
                    </option>
                  ))}
                </select>
                <select
                  value={currentMonth.getFullYear()}
                  onChange={(e) =>
                    setCurrentMonth(
                      new Date(
                        Number(e.target.value),
                        currentMonth.getMonth(),
                        1,
                      ),
                    )
                  }
                  className="bg-transparent font-bold text-gray-700 text-sm hover:text-blue-600 cursor-pointer outline-none appearance-none px-1"
                >
                  {YEARS.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => changeMonth(1)}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-600 cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
            </div>

            {/* Weekdays */}
            <div className="grid grid-cols-7 mb-2">
              {WEEK_DAYS.map((d) => (
                <div
                  key={d}
                  className="text-center text-[11px] font-bold uppercase tracking-wider text-gray-400"
                >
                  {d}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: startDay }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}

              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = new Date(
                  currentMonth.getFullYear(),
                  currentMonth.getMonth(),
                  i + 1,
                );
                const selected = value && isSameDay(day, value);
                const today = isToday(day);

                return (
                  <button
                    key={i}
                    onClick={() => {
                      onChange(day);
                      setOpen(false);
                    }}
                    className={`
                      h-9 w-9 text-sm rounded-xl flex items-center justify-center transition-all duration-200 cursor-pointer
                      ${
                        selected
                          ? "bg-blue-600 text-white shadow-md shadow-blue-200 scale-105 font-semibold"
                          : "hover:bg-blue-50 hover:text-blue-600 text-gray-600"
                      }
                      ${
                        today && !selected
                          ? "border border-blue-200 text-blue-600 font-bold"
                          : ""
                      }
                    `}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>

            {/* Quick Actions */}
            <div className="mt-4 pt-3 border-t border-gray-50 flex justify-between">
              <button
                onClick={() => {
                  onChange(new Date());
                  setOpen(false);
                }}
                className="cursor-pointer text-xs font-semibold text-blue-600 hover:text-blue-700 px-2 py-1"
              >
                Today
              </button>
              <button
                onClick={() => {
                  onChange(null);
                  setOpen(false);
                }}
                className="text-xs font-semibold text-gray-400 hover:text-gray-600 px-2 py-1 cursor-pointer"
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DatePickerInput;
