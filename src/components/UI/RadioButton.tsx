import React from "react";

export interface RadioButtonProps<T = string> {
  id: string;
  name: string;
  value: T;
  checked: boolean;
  onChange: (value: T) => void;
  label: string;
  className?: string;
}

const RadioButton = <T extends string>({
  id,
  name,
  value,
  checked,
  onChange,
  label,
  className = "",
}: RadioButtonProps<T>) => {
  return (
    <div className={`flex items-center ${className}`}>
      <div className="relative">
        <input
          type="radio"
          id={id}
          name={name}
          value={value as string}
          checked={checked}
          onChange={() => onChange(value)}
          className="sr-only"
        />
        <div
          className={`w-4 h-4 rounded-full border-2 transition-colors cursor-pointer ${
            checked
              ? "border-primary bg-primary"
              : "border-gray-300 bg-white hover:border-primary"
          }`}
          onClick={() => onChange(value)}
        >
          {checked && (
            <div className="w-full h-full rounded-full flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-white"></div>
            </div>
          )}
        </div>
      </div>
      <label
        htmlFor={id}
        className="ml-3 text-base font-medium text-gray-900 cursor-pointer"
        onClick={() => onChange(value)}
      >
        <span data-translated>{label}</span>
      </label>
    </div>
  );
};

export { RadioButton };
