import React from "react";
import { UseFormRegisterReturn } from "react-hook-form";

interface FormInputProps {
  id: string;
  type: string;
  label: string;
  placeholder: string;
  register?: UseFormRegisterReturn;
  error?: string;
  className?: string;
}

const FormInput: React.FC<FormInputProps> = ({
  id,
  type,
  label,
  placeholder,
  register,
  error,
  className = "",
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
          error ? "border-red-500 focus:ring-red-500 focus:border-red-500" : ""
        }`}
        {...register}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default FormInput;
