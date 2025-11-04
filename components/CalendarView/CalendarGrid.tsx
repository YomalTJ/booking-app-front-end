// components/CalendarView/CalendarGrid.tsx

import React from "react";
import { CalendarGridProps } from "./types";
import { MONTH_NAMES, WEEK_DAYS, AVAILABILITY_STATUS } from "./constants";

const CalendarGrid: React.FC<CalendarGridProps> = ({
  currentMonth,
  currentYear,
  selectedDate,
  onDateClick,
}) => {
  const monthIndex = MONTH_NAMES.indexOf(currentMonth);
  const firstDay = new Date(currentYear, monthIndex, 1).getDay();
  const daysInMonth = new Date(currentYear, monthIndex + 1, 0).getDate();

  const days: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const getStatusColor = (day: number | null, status: string): string => {
    if (day === selectedDate) {
      return "border-2 border-blue-400 bg-blue-100";
    }
    if (status === "available") return "bg-green-600 text-white";
    if (status === "booked") return "bg-red-600 text-white";
    if (status === "partially") return "bg-yellow-200 text-gray-800";
    return "bg-gray-100 text-gray-700";
  };

  return (
    <div className="p-6">
      <div className="grid grid-cols-7 gap-1 mb-6">
        {WEEK_DAYS.map((day) => (
          <div
            key={day}
            className="text-center text-sm font-semibold text-gray-700 py-2"
          >
            {day}
          </div>
        ))}
        {days.map((day, idx) => (
          <button
            key={idx}
            onClick={() => day && onDateClick(day)}
            disabled={!day}
            className={`
              aspect-square flex items-center justify-center rounded text-sm font-medium
              transition-all cursor-pointer
              ${
                day
                  ? getStatusColor(day, AVAILABILITY_STATUS[day] || "")
                  : "bg-transparent"
              }
              ${day ? "hover:opacity-80" : ""}
            `}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-green-600 rounded"></div>
          <span className="text-gray-700">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-red-600 rounded"></div>
          <span className="text-gray-700">Booked</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-yellow-200 rounded border border-gray-300"></div>
          <span className="text-gray-700">Pending</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-yellow-100 rounded border border-gray-300"></div>
          <span className="text-gray-700">Partially booked</span>
        </div>
      </div>
    </div>
  );
};

export default CalendarGrid;
