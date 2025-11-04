// components/CalendarView/TimeSlots.tsx

import React, { useState } from "react";
import { TimeSlotsProps } from "./types";
import { TIME_SLOTS } from "./constants";
import CustomTimeModal from "./CustomTimeModal";

const TimeSlots: React.FC<TimeSlotsProps> = ({ onClose }) => {
  const [selectedSlot, setSelectedSlot] = useState<string>(
    "09:00 am - 10:00 am"
  );
  const [showCustomTime, setShowCustomTime] = useState<boolean>(false);

  const handleCustomTimeConfirm = (inTime: string, outTime: string) => {
    setSelectedSlot(`${inTime} - ${outTime}`);
    setShowCustomTime(false);
  };

  return (
    <div className="w-full max-w-md">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Time Slots<span className="text-red-500">*</span>
        </h3>

        <div className="grid grid-cols-2 gap-3">
          {TIME_SLOTS.map((slot, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedSlot(slot)}
              className={`py-3 px-4 rounded-lg font-medium transition-all ${
                selectedSlot === slot
                  ? "bg-blue-500 text-white shadow-md"
                  : "border border-gray-300 text-gray-700 hover:border-gray-400"
              }`}
            >
              {slot}
            </button>
          ))}

          <button
            onClick={() => setSelectedSlot("full")}
            className={`py-3 px-4 rounded-lg font-medium transition-all col-span-2 ${
              selectedSlot === "full"
                ? "bg-blue-500 text-white shadow-md"
                : "border border-gray-300 text-gray-700 hover:border-gray-400"
            }`}
          >
            Full Day
          </button>

          <button
            onClick={() => setShowCustomTime(true)}
            className="py-3 px-4 rounded-lg font-medium transition-all col-span-2 border-2 border-dashed border-gray-300 text-gray-700 hover:border-gray-400"
          >
            + Custom Time Slot
          </button>
        </div>
      </div>

      <button
        onClick={onClose}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition"
      >
        Confirm Selection
      </button>

      {/* Custom Time Modal */}
      {showCustomTime && (
        <CustomTimeModal
          onClose={() => setShowCustomTime(false)}
          onConfirm={handleCustomTimeConfirm}
        />
      )}
    </div>
  );
};

export default TimeSlots;
