'use client';

import React from "react";

interface FormInputProps {
  id: string;
  name: string;
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

const FormInput: React.FC<FormInputProps> = ({
  id,
  name,
  label,
  type,
  value,
  onChange,
  placeholder
}) => {
  return (
    <div>
      <label htmlFor={id} className="block text-lg mb-2">
        {label}
      </label>
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder || label}
        className="w-full px-4 py-3 bg-gray-600 bg-opacity-50 border border-gray-500 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5995fd]"
      />
    </div>
  );
};

export default FormInput;