"use client";

import React, { useState, useEffect } from "react";
import CalendarHeader from "@/components/calendar/CalendarHeader";
import CalendarGrid from "@/components/calendar/CalendarGrid";
import AvailableOffices from "@/components/calendar/AvailableOffices";
import { IoClose } from "react-icons/io5";
import { roomService } from "@/services/roomService";

const CalendarView = () => {
  // Get current date for initial state
  const currentDate = new Date();
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

  const [currentMonth, setCurrentMonth] = useState(
    monthNames[currentDate.getMonth()]
  );
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedDateISO, setSelectedDateISO] = useState<string | null>(null);
  const [showOffices, setShowOffices] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [availabilityData, setAvailabilityData] = useState<
    Record<string, { available: number }>
  >({});
  const [isLoading, setIsLoading] = useState(true);

  // Fetch availability data when month or year changes
  useEffect(() => {
    const fetchAvailabilityData = async () => {
      setIsLoading(true);
      try {
        const monthIndex = monthNames.indexOf(currentMonth);
        const data = await roomService.getAvailabilityCountForMonth(
          monthIndex,
          currentYear
        );
        setAvailabilityData(data);
      } catch (error) {
        console.error("Error fetching availability data:", error);
        setNotification("Failed to load availability data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAvailabilityData();
  }, [currentMonth, currentYear]);

  const handleDateClick = (
    day: number,
    isCurrentMonth: boolean,
    isPastDate: boolean
  ) => {
    if (!isCurrentMonth) return;

    if (isPastDate) {
      setNotification("You cannot book offices for past dates.");
      return;
    }

    // Get month index from month name
    const monthIndex = monthNames.indexOf(currentMonth);

    // Create date object
    const selectedDateObj = new Date(currentYear, monthIndex, day);

    // Format as ISO date string YYYY-MM-DD (without time)
    const isoDate = selectedDateObj.toISOString().split("T")[0];

    // Format for display
    const formattedDate = `${currentMonth} ${day}, ${currentYear}`;

    setSelectedDate(formattedDate);
    setSelectedDateISO(isoDate);
    setShowOffices(true);
  };

  const closeOfficesPopup = () => {
    setShowOffices(false);
    setSelectedDate(null);
    setSelectedDateISO(null);
  };

  const closeNotification = () => {
    setNotification(null);
  };

  // Auto-close notification after 3 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl">
      <div className="rounded-xl shadow-lg overflow-hidden">
        {/* Calendar Controls and Header */}
        <CalendarHeader
          currentMonth={currentMonth}
          currentYear={currentYear}
          setCurrentMonth={setCurrentMonth}
          setCurrentYear={setCurrentYear}
        />

        {/* Calendar Grid */}
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading availability data...</p>
          </div>
        ) : (
          <CalendarGrid
            currentMonth={currentMonth}
            currentYear={currentYear}
            availabilityData={availabilityData}
            selectedDate={selectedDate}
            handleDateClick={handleDateClick}
          />
        )}
      </div>

      {/* Available Offices Section */}
      {showOffices && selectedDateISO && (
        <AvailableOffices
          selectedDate={selectedDate || ""}
          selectedDateISO={selectedDateISO}
          onClose={closeOfficesPopup}
        />
      )}

      {/* Notification Message */}
      {notification && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center z-50">
          <span>{notification}</span>
          <button
            onClick={closeNotification}
            className="ml-3 text-white hover:text-gray-200 focus:outline-none"
          >
            <IoClose size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default CalendarView;
