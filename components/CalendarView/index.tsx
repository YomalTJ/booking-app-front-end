"use client";

import React, { useState } from "react";
import CalendarHeader from "./CalendarHeader";
import CalendarGrid from "./CalendarGrid";
import TimeSlots from "./TimeSlots";
import { bookingService } from "@/services/bookingService";
import { MONTH_NAMES } from "./constants";
import toast from "react-hot-toast";
import RoomSelector from "./RoomSelector";

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
  const [selectedRoomName, setSelectedRoomName] = useState<string | null>(null);
  const [bookingData, setBookingData] = useState<BookingData | undefined>(
    undefined
  );
  const [showTimeSlots, setShowTimeSlots] = useState<boolean>(false);
  const [isBooking, setIsBooking] = useState<boolean>(false);

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

  const handleTimeSlotConfirm = async (data: BookingData): Promise<void> => {
    if (!selectedRoomId || !selectedDate) {
      toast.error("Please select a room and date");
      return;
    }

    setBookingData(data);
    setIsBooking(true);

    try {
      const bookingDate = getSelectedDateString();
      if (!bookingDate) {
        throw new Error("Invalid date");
      }

      const result = await bookingService.createBooking({
        roomId: selectedRoomId,
        bookingDate: bookingDate,
        startTime: data.startTime,
        endTime: data.endTime,
        isFullDayBooking: data.isFullDay,
      });

      toast.success("Booking created successfully!");

      // Reset form
      setSelectedDate(null);
      setBookingData(undefined);
      setShowTimeSlots(false);

      // Refresh page to show updated bookings
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1500);
    } catch (error: any) {
      toast.error(error.message || "Failed to create booking");
    } finally {
      setIsBooking(false);
    }
  };

  const handleRoomSelect = (roomId: string, roomName?: string): void => {
    setSelectedRoomId(roomId);
    setSelectedRoomName(roomName || null);
  };

  const progressStep = selectedRoomId
    ? selectedDate
      ? showTimeSlots
        ? 2
        : 1
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

  const getBookingSummary = (): string => {
    if (!selectedRoomName || !bookingData) return "";

    const timeInfo = bookingData.isFullDay
      ? "Full Day"
      : `${bookingData.startTime} - ${bookingData.endTime}`;

    return `You are booking ${selectedRoomName} for ${timeInfo}`;
  };

  return (
    <>
      {/* Main Content */}
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
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

                  {/* Booking Summary */}
                  {bookingData && (
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-700 text-center">
                        {getBookingSummary()}
                      </p>
                    </div>
                  )}

                  {/* Loading State */}
                  {isBooking && (
                    <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-orange-500"></div>
                        <p className="text-sm text-orange-700">
                          Creating booking...
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
