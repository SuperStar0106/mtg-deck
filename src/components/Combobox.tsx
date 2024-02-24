import React, { useState, useRef, useEffect, ChangeEvent } from "react";
import { Controller } from "react-hook-form";

type ComboboxProps = {
  name: string;
  options: string[];
  placeholder?: string;
  control: any;
  setValue: (name: string, value: any) => void;
  getValue: (name: string) => any;
  currentSelectedItems?: string[];
};

const Combobox: React.FC<ComboboxProps> = (props) => {
  const {
    name,
    options,
    placeholder = "Select an option",
    control,
    setValue,
    getValue,
    currentSelectedItems,
  } = props;

  const [isOpen, setIsOpen] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState<string[]>(options);
  const [inputValue, setInputValue] = useState("");
  const [selectedOptions, setSelectedOptions] = useState<string[]>(
    currentSelectedItems || []
  );
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const currentValue = getValue(name);
    setInputValue(currentValue || "");
  }, [getValue, name]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const newFilteredOptions = options.filter(
      (option) => !selectedOptions.includes(option)
    );
    setFilteredOptions(newFilteredOptions);
  }, [options, selectedOptions]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleOptionClick = (option: string) => {
    if (!selectedOptions.includes(option)) {
      setSelectedOptions([...selectedOptions, option]);
      setValue(name, [...selectedOptions, option]);
    }
    setInputValue("");
    setIsOpen(false);
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const handleInputBlur = () => {
    setTimeout(() => setIsOpen(false), 200);
  };

  const handleRemoveOption = (option: string) => {
    const newSelectedOptions = selectedOptions.filter(
      (selectedOption) => selectedOption !== option
    );
    setSelectedOptions(newSelectedOptions);
    setValue(name, newSelectedOptions);
    setInputValue("");
  };

  return (
    <div className="relative">
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div>
            <input
              {...field}
              type="text"
              value={inputValue}
              onChange={(e) => {
                handleInputChange(e);
                field.onChange(e);
              }}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              placeholder={placeholder}
              className="block px-4 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              ref={inputRef}
            />
            {selectedOptions.map((option) => (
              <div
                key={option}
                className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mt-2"
              >
                {option}
                <button
                  type="button"
                  onClick={() => handleRemoveOption(option)}
                  className="flex-shrink-0 ml-1.5"
                >
                  <svg
                    className="h-4 w-4 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6  18L18  6M6  6l12  12"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      />
      {isOpen && (
        <ul className="absolute left-0 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {filteredOptions.map((option, index) => (
            <li
              key={index}
              onClick={() => handleOptionClick(option)}
              className="cursor-pointer px-4 py-2 hover:bg-gray-100"
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Combobox;
