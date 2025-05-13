"use client";

import React from "react";

interface PasswordInputProps {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  id,
  name,
  label,
  value,
  onChange,
}) => {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-lg mb-2"
      >
        {label}
      </label>
      <input
        type="password"
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={label}
        className="w-full px-4 py-3 bg-gray-600 bg-opacity-50 border border-gray-500 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5995fd]"
        required
      />
    </div>
  );
};

export default PasswordInput;