"use client";

import React, { useState } from "react";
import CalendarHeader from "./CalendarHeader";
import CalendarGrid from "./CalendarGrid";
import TimeSlots from "./TimeSlots";
import AvailableOffices from "./AvailableOffices";
import RoomSelector from "./RoomSelector";
import { MONTH_NAMES } from "./constants";

interface BookingData {
  startTime: string;
  endTime: string;
  isFullDay: boolean;
}

export default function CalendarView() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState<string>(
    MONTH_NAMES[today.getMonth()]
  );
  const [currentYear, setCurrentYear] = useState<number>(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [bookingData, setBookingData] = useState<BookingData | undefined>(
    undefined
  );
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

  const handleTimeSlotConfirm = (data: BookingData): void => {
    setBookingData(data);
    setShowTimeSlots(false);
    setShowOffices(true);
  };

  const closeOffices = (): void => {
    setShowOffices(false);
    setSelectedDate(null);
    setBookingData(undefined);
  };

  const handleRoomSelect = (roomId: string): void => {
    setSelectedRoomId(roomId);
  };

  const progressStep = selectedRoomId
    ? selectedDate
      ? showOffices
        ? 3
        : 2
      : 1
    : 0;

  // Convert selected date to YYYY-MM-DD string properly
  const getSelectedDateString = (): string | null => {
    if (!selectedDate) return null;

    const monthIndex = MONTH_NAMES.indexOf(currentMonth);
    const year = currentYear;
    const month = String(monthIndex + 1).padStart(2, "0");
    const day = String(selectedDate).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  return (
    <>
      {/* Main Content */}
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          {/* Progress Indicator */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <div
              className={`w-4 h-4 rounded-full transition-colors ${
                progressStep >= 1 ? "bg-orange-500" : "bg-gray-300"
              }`}
            ></div>
            <div
              className={`flex-1 h-1 transition-colors ${
                progressStep >= 2 ? "bg-orange-500" : "bg-gray-300"
              }`}
            ></div>
            <div
              className={`w-4 h-4 rounded-full transition-colors ${
                progressStep >= 2 ? "bg-orange-500" : "bg-gray-300"
              }`}
            ></div>
            <div
              className={`flex-1 h-1 transition-colors ${
                progressStep >= 3 ? "bg-orange-500" : "bg-gray-300"
              }`}
            ></div>
            <div
              className={`w-4 h-4 rounded-full transition-colors ${
                progressStep >= 3 ? "bg-orange-500" : "bg-gray-300"
              }`}
            ></div>
          </div>

          {/* Room Selector */}
          <RoomSelector
            selectedRoomId={selectedRoomId}
            onRoomSelect={handleRoomSelect}
          />

          {selectedRoomId && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
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
                    selectedRoomId={selectedRoomId}
                  />
                </div>
              </div>

              {/* Time Slots Section */}
              {showTimeSlots && (
                <div className="bg-white rounded-2xl shadow-lg p-8 h-fit">
                  <TimeSlots
                    onClose={() => setShowTimeSlots(false)}
                    selectedDate={selectedDate}
                    selectedRoomId={selectedRoomId}
                    onTimeSlotConfirm={handleTimeSlotConfirm}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal Backdrop */}
      {showOffices && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40">
          <AvailableOffices
            selectedDate={getSelectedDateString()}
            onClose={closeOffices}
            bookingData={bookingData}
          />
        </div>
      )}
    </>
  );
}
