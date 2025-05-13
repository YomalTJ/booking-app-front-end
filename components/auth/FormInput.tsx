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
        className={`w-full p-4 bg-gray-100 rounded-full text-gray-700 border transition ${
          error
            ? "border-red-500 focus:ring-red-300"
            : "border-transparent focus:ring-2 focus:ring-[#5995fd] focus:border-[#5995fd]"
        }`}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default FormInput;
