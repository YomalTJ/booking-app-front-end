"use client";

import React from "react";
import CalendarDay from "./CalendarDay";
import { generateCalendarDays } from "@/utils/calendarUtils";

interface CalendarGridProps {
  currentMonth: string;
  currentYear: number;
  availabilityData: Record<string, { available: number }>;
  selectedDate: string | null;
  handleDateClick: (
    day: number,
    isCurrentMonth: boolean,
    isPastDate: boolean
  ) => void;
}

const CalendarGrid: React.FC<CalendarGridProps> = ({
  currentMonth,
  currentYear,
  availabilityData,
  selectedDate,
  handleDateClick,
}) => {
  const { prevMonthDays, currentMonthDays, nextMonthDays } =
    generateCalendarDays(currentMonth, currentYear);

  return (
    <div className="calendar-grid bg-white text-gray-800">
      {/* Day Headers */}
      <div className="grid grid-cols-7 text-center bg-gray-100">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
          <div
            key={day}
            className="py-2 font-semibold text-gray-600 text-xs uppercase"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Days */}
      <div className="grid grid-cols-7 gap-1">
        {[...prevMonthDays, ...currentMonthDays, ...nextMonthDays].map(
          (day) => (
            <CalendarDay
              key={`${day.month}-${day.day}`}
              day={day.day}
              isCurrentMonth={day.isCurrentMonth}
              isPastDate={day.isPastDate}
              isToday={day.isToday}
              availability={
                day.isCurrentMonth ? availabilityData[day.day]?.available : null
              }
              selectedDate={selectedDate}
              currentMonth={currentMonth}
              currentYear={currentYear}
              onDateClick={() =>
                handleDateClick(day.day, day.isCurrentMonth, day.isPastDate)
              }
            />
          )
        )}
      </div>
    </div>
  );
};

export default CalendarGrid;
