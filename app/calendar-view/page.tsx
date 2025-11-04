"use client";

import React, { useState } from "react";

// Types
interface CalendarHeaderProps {
  currentMonth: string;
  currentYear: number;
  onNextMonth: () => void;
}

interface CalendarGridProps {
  currentMonth: string;
  currentYear: number;
  selectedDate: number | null;
  onDateClick: (day: number) => void;
}

interface TimeSlotsProps {
  onClose: () => void;
}

interface AvailableOfficesProps {
  selectedDate: number | null;
  onClose: () => void;
}

interface Office {
  id: number;
  name: string;
  capacity: number;
  floor: number;
}

// Calendar Header Component
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

// Calendar Grid Component
const CalendarGrid: React.FC<CalendarGridProps> = ({
  currentMonth,
  currentYear,
  selectedDate,
  onDateClick,
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

  const weekDays = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];

  const monthIndex = monthNames.indexOf(currentMonth);
  const firstDay = new Date(currentYear, monthIndex, 1).getDay();
  const daysInMonth = new Date(currentYear, monthIndex + 1, 0).getDate();

  const days: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  // Mock availability data with proper typing
  const availabilityStatus: Record<number, string> = {
    3: "available",
    4: "available",
    5: "booked",
    6: "booked",
    7: "booked",
    8: "available",
    9: "available",
    10: "available",
    11: "partially",
    12: "available",
    13: "available",
    14: "available",
    15: "available",
    16: "available",
    17: "available",
    18: "available",
    19: "available",
    20: "available",
    21: "available",
    22: "available",
    23: "available",
    24: "available",
    25: "available",
    26: "available",
    27: "available",
    28: "available",
    29: "available",
    30: "available",
  };

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
        {weekDays.map((day) => (
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
                  ? getStatusColor(day, availabilityStatus[day] || "")
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

// Time Slots Component
const TimeSlots: React.FC<TimeSlotsProps> = ({ onClose }) => {
  const [selectedSlot, setSelectedSlot] = useState<string>(
    "09:00 am - 10:00 am"
  );

  const slots = [
    "09:00 am - 10:00 am",
    "10:00 am - 11:00 am",
    "11:00 am - 12:00 pm",
    "12:00 pm - 1:00 pm",
    "1:00 pm - 2:00 pm",
    "2:00 pm - 3:00 pm",
    "3:00 pm - 4:00 pm",
    "4:00 pm - 5:00 pm",
    "5:00 pm - 6:00 pm",
    "6:00 pm - 7:00 pm",
  ];

  return (
    <div className="w-full max-w-md">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Time Slots<span className="text-red-500">*</span>
        </h3>

        <div className="grid grid-cols-2 gap-3">
          {slots.map((slot, idx) => (
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
        </div>
      </div>

      <button
        onClick={onClose}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition"
      >
        Confirm Selection
      </button>
    </div>
  );
};

// Available Offices Component
const AvailableOffices: React.FC<AvailableOfficesProps> = ({
  selectedDate,
  onClose,
}) => {
  const offices: Office[] = [
    { id: 1, name: "Conference Room A", capacity: 10, floor: 2 },
    { id: 2, name: "Meeting Room B", capacity: 6, floor: 3 },
    { id: 3, name: "Board Room", capacity: 20, floor: 4 },
    { id: 4, name: "Collaboration Space", capacity: 8, floor: 2 },
  ];

  const [selectedOffice, setSelectedOffice] = useState<number | null>(null);

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

  const currentMonth = monthNames[new Date().getMonth()];
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
            >
              ×
            </button>
          </div>
        </div>

        {/* Offices List */}
        <div className="p-6 space-y-4">
          {offices.map((office) => (
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

// Main Calendar View Component
export default function CalendarView() {
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

  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState<string>(
    monthNames[today.getMonth()]
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
    const monthIndex = monthNames.indexOf(currentMonth);
    if (monthIndex === 11) {
      setCurrentMonth("January");
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(monthNames[monthIndex + 1]);
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
    <div className="min-h-screen bg-gray-50 py-8">
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
