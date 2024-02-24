import React from "react";

interface SelectProps {
  value: number | string;
  options: number[] | string[];
  onChange: (value: any) => void;
}

const Select: React.FC<SelectProps> = ({ value, options, onChange }) => {
  const selectRef = React.useRef<HTMLSelectElement>(null);

  React.useEffect(() => {
    if (selectRef.current) {
      selectRef.current.focus();
    }
  }, []);

  return (
    <select
      ref={selectRef}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="form-select block w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
    >
      {options.map((option, index) => (
        <option key={index} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};

export default Select;
