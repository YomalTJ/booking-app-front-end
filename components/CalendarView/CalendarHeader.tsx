import React from "react";
import { CalendarHeaderProps } from "./types";

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentMonth,
  currentYear,
  onNextMonth,
}) => {
  return (
    <div className="flex items-center justify-between p-6">
      <h2 className="text-xl font-bold text-gray-800">
        {currentMonth} {currentYear}
      </h2>
      <button
        onClick={onNextMonth}
        className="text-gray-600 hover:text-gray-800 transition"
        aria-label="Next month"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  );
};

export default CalendarHeader;
