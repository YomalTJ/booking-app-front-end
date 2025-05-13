"use client";

import React from "react";

interface MonthYearSelectorProps {
  currentMonth: string;
  currentYear: number;
  setCurrentMonth: (month: string) => void;
  setCurrentYear: (year: number) => void;
}

const MonthYearSelector: React.FC<MonthYearSelectorProps> = ({
  currentMonth,
  currentYear,
  setCurrentMonth,
  setCurrentYear,
}) => {
  // Month and year options
  const months = [
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

  const years = Array.from({ length: 10 }, (_, i) => 2020 + i);

  return (
    <div className="flex flex-col md:flex-row items-start gap-y-5 md:gap-y-0 md:items-center space-x-4 mb-4 md:mb-0 w-full">
      <div className="flex items-center">
        <span className="text-gray-600 mr-2">Month:</span>
        <select
          className="bg-white text-gray-800 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5995fd]"
          value={currentMonth}
          onChange={(e) => setCurrentMonth(e.target.value)}
        >
          {months.map((month) => (
            <option key={month} value={month} className="text-black">
              {month}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center">
        <span className="text-gray-600 mr-2">Year:</span>
        <select
          className="bg-white text-gray-800 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5995fd]"
          value={currentYear}
          onChange={(e) => setCurrentYear(parseInt(e.target.value))}
        >
          {years.map((year) => (
            <option key={year} value={year} className="text-black">
              {year}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center">
        <span className="text-gray-600 mr-2">Seat Count:</span>
        <select className="bg-white text-gray-800 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5995fd]">
          <option value="all" className="text-black">
            All
          </option>
          <option value="1" className="text-black">
            1
          </option>
          <option value="2" className="text-black">
            2
          </option>
          <option value="3" className="text-black">
            3
          </option>
        </select>
      </div>
    </div>
  );
};

export default MonthYearSelector;
