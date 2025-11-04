// components/CalendarView/index.tsx

"use client";

import React, { useState } from "react";
import CalendarHeader from "./CalendarHeader";
import CalendarGrid from "./CalendarGrid";
import TimeSlots from "./TimeSlots";
import AvailableOffices from "./AvailableOffices";
import { MONTH_NAMES } from "./constants";

export default function CalendarView() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState<string>(
    MONTH_NAMES[today.getMonth()]
  );
  const [currentYear, setCurrentYear] = useState<number>(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [showOffices, setShowOffices] = useState<boolean>(false);
  const [showTimeSlots, setShowTimeSlots] = useState<boolean>(false);

  const handleDateClick = (day: number): void => {
    setSelectedDate(day);
    setShowTimeSlots(true);
  };

  const handleNextMonth = (): void => {
    const monthIndex = MONTH_NAMES.indexOf(currentMonth);
    if (monthIndex === 11) {
      setCurrentMonth("January");
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(MONTH_NAMES[monthIndex + 1]);
    }
  };

  const closeTimeSlots = (): void => {
    setShowTimeSlots(false);
    setShowOffices(true);
  };

  const closeOffices = (): void => {
    setShowOffices(false);
    setSelectedDate(null);
  };

  return (
    <div
      className={`min-h-screen bg-gray-50 py-8 ${showOffices ? "blur-sm" : ""}`}
    >
      <div className="max-w-6xl mx-auto px-4">
        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <div className="w-4 h-4 rounded-full bg-blue-500"></div>
          <div className="flex-1 h-1 bg-gray-300"></div>
          <div className="w-4 h-4 rounded-full bg-gray-300"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <CalendarHeader
                currentMonth={currentMonth}
                currentYear={currentYear}
                onNextMonth={handleNextMonth}
              />
              <CalendarGrid
                currentMonth={currentMonth}
                currentYear={currentYear}
                selectedDate={selectedDate}
                onDateClick={handleDateClick}
              />
            </div>
          </div>

          {/* Time Slots Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 h-fit">
            <TimeSlots onClose={closeTimeSlots} />
          </div>
        </div>
      </div>

      {/* Available Offices Modal */}
      {showOffices && (
        <AvailableOffices selectedDate={selectedDate} onClose={closeOffices} />
      )}
    </div>
  );
}
