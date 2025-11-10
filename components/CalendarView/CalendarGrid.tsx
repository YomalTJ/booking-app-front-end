import React, { useEffect, useState } from "react";
import { CalendarGridProps } from "./types";
import { MONTH_NAMES, WEEK_DAYS } from "./constants";
import { bookingService } from "@/services/bookingService";
import toast from "react-hot-toast";

interface DayStatus {
  [key: number]: "available" | "fully_booked" | "partially_booked" | "loading";
}

const CalendarGrid: React.FC<CalendarGridProps> = ({
  currentMonth,
  currentYear,
  selectedDate,
  onDateClick,
  selectedRoomId,
}) => {
  const [dayStatus, setDayStatus] = useState<DayStatus>({});
  const [isLoading, setIsLoading] = useState(true);

  const monthIndex = MONTH_NAMES.indexOf(currentMonth);
  const firstDay = new Date(currentYear, monthIndex, 1).getDay();
  const daysInMonth = new Date(currentYear, monthIndex + 1, 0).getDate();

  useEffect(() => {
    // Check availability for all days in the month
    const checkAllDays = async () => {
      if (!selectedRoomId) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      const newDayStatus: DayStatus = {};

      try {
        for (let day = 1; day <= daysInMonth; day++) {
          // Create date in YYYY-MM-DD format (local time, no timezone conversion)
          const year = currentYear;
          const month = String(monthIndex + 1).padStart(2, "0");
          const dayStr = String(day).padStart(2, "0");
          const bookingDate = `${year}-${month}-${dayStr}`;

          const result = await bookingService.checkAvailability(
            selectedRoomId,
            bookingDate
          );

          newDayStatus[day] = result.type;
        }
        setDayStatus(newDayStatus);
      } catch (error) {
        console.error("Error checking days:", error);
        toast.error("Failed to load availability data");
      } finally {
        setIsLoading(false);
      }
    };

    checkAllDays();
  }, [selectedRoomId, currentMonth, currentYear, daysInMonth, monthIndex]);

  const days: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const isPastDate = (day: number): boolean => {
    const today = new Date();
    const selectedDate = new Date(currentYear, monthIndex, day);

    // Compare dates without time
    const todayDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const selectedDateOnly = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate()
    );

    return selectedDateOnly < todayDate;
  };

  const getStatusColor = (day: number | null): string => {
    if (!day) return "bg-transparent";

    // Fixed: Direct comparison without creating new dates
    if (day === selectedDate) {
      return "border-2 border-orange-500 bg-orange-100";
    }

    // Disable past dates
    if (isPastDate(day)) {
      return "bg-gray-100 text-gray-400 cursor-not-allowed";
    }

    const status = dayStatus[day];

    switch (status) {
      case "available":
        return "bg-green-300 text-white hover:bg-green-400";
      case "fully_booked":
        return "bg-red-300 text-white cursor-not-allowed hover:bg-red-400";
      case "partially_booked":
        return "bg-yellow-200 text-gray-800 hover:bg-yellow-300";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const handleDateClick = (day: number | null) => {
    if (!day) return;

    // Disable past dates
    if (isPastDate(day)) {
      toast.error("Cannot select past dates");
      return;
    }

    if (dayStatus[day] === "fully_booked") {
      toast.error("This room is fully booked for the entire day.");
      return;
    }

    // Pass the day number directly
    onDateClick(day);
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex flex-col items-center justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Loading Calendar</p>
          <p className="text-sm text-gray-500 mt-2">
            Please wait while we check availability
          </p>
        </div>
      </div>
    );
  }

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
            onClick={() => handleDateClick(day)}
            disabled={
              !day || isPastDate(day) || dayStatus[day] === "fully_booked"
            }
            className={`
              aspect-square flex items-center justify-center rounded text-sm font-medium
              transition-all
              ${getStatusColor(day)}
              ${day ? "cursor-pointer" : ""}
            `}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-300 rounded"></div>
          <span className="text-gray-500">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-300 rounded"></div>
          <span className="text-gray-500">Fully Booked</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-200 rounded"></div>
          <span className="text-gray-500">Partially Booked</span>
        </div>
      </div>
    </div>
  );
};

export default CalendarGrid;
