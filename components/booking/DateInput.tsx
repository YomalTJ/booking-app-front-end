"use client";

import React from "react";
import { FaCalendarAlt } from "react-icons/fa";

interface DateInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

const DateInput: React.FC<DateInputProps> = ({ label, value, onChange }) => {
  return (
    <div>
      <label className="block text-white text-lg mb-2">{label}</label>
      <div className="relative">
        <input
          type="text"
          placeholder="mm/dd/yyyy"
          onFocus={(e) => (e.target.type = "date")}
          onBlur={(e) => {
            if (!e.target.value) e.target.type = "text";
          }}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full p-3 pr-10 bg-gray-600 bg-opacity-50 text-white border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5995fd] placeholder-gray-400"
          required
        />
        <FaCalendarAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>
    </div>
  );
};

export default DateInput;
