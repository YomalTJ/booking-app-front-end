// components/CalendarView/CustomTimeModal.tsx

import React, { useState } from "react";
import { CustomTimeModalProps } from "./types";

const CustomTimeModal: React.FC<CustomTimeModalProps> = ({
  onClose,
  onConfirm,
}) => {
  const [inTime, setInTime] = useState<string>("09:00");
  const [outTime, setOutTime] = useState<string>("10:00");

  const handleConfirm = () => {
    onConfirm(inTime, outTime);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-800">
            Custom Time Slot
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              In Time <span className="text-red-500">*</span>
            </label>
            <input
              type="time"
              value={inTime}
              onChange={(e) => setInTime(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Out Time <span className="text-red-500">*</span>
            </label>
            <input
              type="time"
              value={outTime}
              onChange={(e) => setOutTime(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomTimeModal;
