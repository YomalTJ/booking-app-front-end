"use client";

import React from "react";

interface CalendarDayProps {
  day: number;
  isCurrentMonth?: boolean;
  isPastDate?: boolean;
  isToday?: boolean;
  availability?: number | null;
  selectedDate: string | null;
  currentMonth: string;
  currentYear: number;
  onDateClick: () => void;
}

const CalendarDay: React.FC<CalendarDayProps> = ({
  day,
  isCurrentMonth = true,
  isPastDate = false,
  isToday = false,
  availability = null,
  selectedDate,
  currentMonth,
  currentYear,
  onDateClick,
}) => {
  const isSelected =
    selectedDate && selectedDate.includes(`${currentMonth} ${day}`);

  const isBookable = isCurrentMonth && !isPastDate;

  const dayClasses = `
    h-16 sm:h-20 p-1 relative transition-colors rounded
    ${isCurrentMonth ? "text-gray-800" : "text-gray-400 bg-gray-50"}
    ${isPastDate && isCurrentMonth ? "bg-gray-100" : ""}
    ${isToday ? "border border-blue-500" : ""}
    ${isSelected ? "border-2 border-blue-500 bg-blue-100" : ""}
    ${isBookable ? "hover:bg-blue-50 cursor-pointer" : "cursor-default"}
  `;

  return (
    <div
      className={dayClasses}
      onClick={isBookable ? onDateClick : undefined}
      title={
        isPastDate ? "Past dates are not available for booking" : undefined
      }
    >
      <div
        className={`text-sm font-medium text-center ${
          isToday ? "text-blue-600" : ""
        }`}
      >
        {day}
      </div>

      {availability !== null && availability !== undefined && isBookable && (
        <div className="absolute bottom-1 left-1 right-1 text-center">
          <div
            className={`${
              availability > 0
                ? "bg-blue-100 text-blue-600"
                : "bg-gray-100 text-gray-500"
            } text-xs rounded-full px-2 py-0.5`}
          >
            {availability > 0 ? `${availability} Available` : "No Rooms"}
          </div>
        </div>
      )}

      {isPastDate && isCurrentMonth && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="absolute inset-0 bg-gray-200 opacity-50 rounded"></div>
          <div className="text-xs text-gray-500 relative z-10">
            Not Available
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarDay;
