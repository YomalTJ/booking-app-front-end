"use client";

import React from "react";
import { FaChevronLeft, FaChevronRight, FaCalendarDay } from "react-icons/fa";

interface CalendarHeaderProps {
  currentMonth: string;
  currentYear: number;
  setCurrentMonth: (month: string) => void;
  setCurrentYear: (year: number) => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentMonth,
  currentYear,
  setCurrentMonth,
  setCurrentYear,
}) => {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const handlePrevMonth = () => {
    const currentMonthIndex = monthNames.indexOf(currentMonth);
    const newMonthIndex = currentMonthIndex === 0 ? 11 : currentMonthIndex - 1;
    const newYear = currentMonthIndex === 0 ? currentYear - 1 : currentYear;

    setCurrentMonth(monthNames[newMonthIndex]);
    setCurrentYear(newYear);
  };

  const handleNextMonth = () => {
    const currentMonthIndex = monthNames.indexOf(currentMonth);
    const newMonthIndex = currentMonthIndex === 11 ? 0 : currentMonthIndex + 1;
    const newYear = currentMonthIndex === 11 ? currentYear + 1 : currentYear;

    setCurrentMonth(monthNames[newMonthIndex]);
    setCurrentYear(newYear);
  };

  const handleTodayClick = () => {
    const today = new Date();
    setCurrentMonth(monthNames[today.getMonth()]);
    setCurrentYear(today.getFullYear());
  };

  return (
    <div className="bg-gray-100 border-b border-gray-200">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-2">
          <FaCalendarDay className="text-blue-600" />
          <span className="text-lg font-semibold text-gray-800">
            {currentMonth} {currentYear}
          </span>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleTodayClick}
            className="bg-blue-500 text-white px-3 py-2 rounded-md text-sm hover:bg-blue-600 transition"
          >
            Today
          </button>
          <button
            onClick={handlePrevMonth}
            className="bg-gray-200 text-gray-700 p-2 rounded-md hover:bg-gray-300 transition"
          >
            <FaChevronLeft />
          </button>
          <button
            onClick={handleNextMonth}
            className="bg-gray-200 text-gray-700 p-2 rounded-md hover:bg-gray-300 transition"
          >
            <FaChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CalendarHeader;
