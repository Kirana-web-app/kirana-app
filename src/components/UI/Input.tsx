import React from "react";
import { UseFormRegisterReturn } from "react-hook-form";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  registration?: UseFormRegisterReturn;
  required?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, registration, required, ...props }, ref) => {
    const inputClasses = `w-full px-4 py-3 text-base text-gray-900 placeholder-gray-500 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
      error
        ? "border-red-300 focus:ring-red-500"
        : "border-gray-300 focus:ring-primary"
    } ${className || ""}`;

    return (
      <div>
        {label && (
          <label
            htmlFor={props.id}
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          className={inputClasses}
          aria-required={required}
          {...registration}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
