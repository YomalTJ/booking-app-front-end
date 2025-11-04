// components/CalendarView/AvailableOffices.tsx

import React, { useState } from "react";
import { AvailableOfficesProps } from "./types";
import { MONTH_NAMES, MOCK_OFFICES } from "./constants";

const AvailableOffices: React.FC<AvailableOfficesProps> = ({
  selectedDate,
  onClose,
}) => {
  const [selectedOffice, setSelectedOffice] = useState<number | null>(null);

  const currentMonth = MONTH_NAMES[new Date().getMonth()];
  const currentYear = new Date().getFullYear();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-96 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Available Offices
              </h2>
              <p className="text-gray-600 mt-1">
                Selected Date: {currentMonth} {selectedDate}, {currentYear}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
              aria-label="Close modal"
            >
              ×
            </button>
          </div>
        </div>

        {/* Offices List */}
        <div className="p-6 space-y-4">
          {MOCK_OFFICES.map((office) => (
            <button
              key={office.id}
              onClick={() => setSelectedOffice(office.id)}
              className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                selectedOffice === office.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-800">{office.name}</h3>
                  <div className="flex gap-4 mt-2 text-sm text-gray-600">
                    <span>Capacity: {office.capacity} people</span>
                    <span>Floor: {office.floor}</span>
                  </div>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedOffice === office.id
                      ? "border-blue-500 bg-blue-500"
                      : "border-gray-300"
                  }`}
                >
                  {selectedOffice === office.id && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            disabled={!selectedOffice}
            className="flex-1 px-4 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-semibold rounded-lg transition"
          >
            Book Office
          </button>
        </div>
      </div>
    </div>
  );
};

export default AvailableOffices;
