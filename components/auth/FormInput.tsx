import React from "react";
import { UseFormRegisterReturn } from "react-hook-form";

interface FormInputProps {
  id: string;
  type: string;
  label: string;
  placeholder: string;
  register?: UseFormRegisterReturn;
  error?: string;
}

const FormInput: React.FC<FormInputProps> = ({
  id,
  type,
  label,
  placeholder,
  register,
  error,
}) => {
  return (
    <div>
      <label htmlFor={id} className="block text-gray-700 font-medium mb-2">
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        {...register}
        className={`w-full p-4 bg-gray-50 rounded-lg text-gray-700 border-2 transition focus:outline-none ${
          error
            ? "border-red-500 focus:ring-2 focus:ring-red-200 focus:border-red-500"
            : "border-gray-200 focus:ring-2 focus:ring-orange-200 focus:border-orange-500"
        }`}
      />
      {error && <p className="text-red-500 text-sm mt-2 font-medium">{error}</p>}
    </div>
  );
};

export default FormInput;