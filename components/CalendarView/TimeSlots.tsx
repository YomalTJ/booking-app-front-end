import React, { useEffect, useState } from "react";
import { TimeSlotsProps } from "./types";
import { bookingService } from "@/services/bookingService";
import toast from "react-hot-toast";

interface BookedSlot {
  startTime: string;
  endTime: string;
}

const TimeSlots: React.FC<TimeSlotsProps> = ({
  onClose,
  selectedDate,
  selectedRoomId,
  onTimeSlotConfirm,
}) => {
  const [inTime, setInTime] = useState<string>("08:00");
  const [outTime, setOutTime] = useState<string>("11:00");
  const [bookedSlots, setBookedSlots] = useState<BookedSlot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFullDay, setIsFullDay] = useState(false);

  // Business hours constraints
  const BUSINESS_OPEN = "08:00";
  const BUSINESS_CLOSE = "18:00"; // 6 PM

  useEffect(() => {
    const loadBookedSlots = async () => {
      if (!selectedRoomId || selectedDate === null) return;

      setIsLoading(true);
      try {
        const today = new Date();
        const monthIndex = today.getMonth();
        const currentYear = today.getFullYear();

        const month = String(monthIndex + 1).padStart(2, "0");
        const dayStr = String(selectedDate).padStart(2, "0");
        const bookingDate = `${currentYear}-${month}-${dayStr}`;

        const result = await bookingService.checkAvailability(
          selectedRoomId,
          bookingDate
        );

        if (result.type === "fully_booked") {
          toast.error("This room is fully booked for this day.");
          setBookedSlots([]);
          return;
        }

        if (result.type === "partially_booked" && result.bookedRanges) {
          setBookedSlots(result.bookedRanges);
        } else {
          setBookedSlots([]);
        }
      } catch (error) {
        console.error("Error loading booked slots:", error);
        toast.error("Failed to load booked time slots");
      } finally {
        setIsLoading(false);
      }
    };

    loadBookedSlots();
  }, [selectedRoomId, selectedDate]);

  // Check if full day booking is possible
  const canBookFullDay = (): boolean => {
    return bookedSlots.length === 0;
  };

  const isTimeInPast = (): boolean => {
    if (!selectedDate) return false;

    const today = new Date();
    const selectedDateTime = new Date();
    selectedDateTime.setFullYear(today.getFullYear());
    selectedDateTime.setMonth(today.getMonth());
    selectedDateTime.setDate(selectedDate);

    const [inHours, inMinutes] = inTime.split(":").map(Number);
    selectedDateTime.setHours(inHours, inMinutes, 0, 0);

    return selectedDateTime < today;
  };

  const isSlotOverlapping = (start: string, end: string): boolean => {
    return bookedSlots.some((booked) => {
      return !(end <= booked.startTime || start >= booked.endTime);
    });
  };

  // Check if time is within business hours
  const isWithinBusinessHours = (time: string): boolean => {
    return time >= BUSINESS_OPEN && time <= BUSINESS_CLOSE;
  };

  // Check if entire time range is within business hours
  const isTimeRangeWithinBusinessHours = (
    start: string,
    end: string
  ): boolean => {
    return isWithinBusinessHours(start) && isWithinBusinessHours(end);
  };

  const validateTimeSelection = (): string | null => {
    if (isFullDay) {
      if (!canBookFullDay()) {
        return "Full day booking not available due to existing bookings";
      }
      return null;
    }

    const start = inTime;
    const end = outTime;

    // Check if in time is before out time
    if (start >= end) {
      return "Out time must be after in time";
    }

    // Check if times are within business hours (8 AM - 6 PM)
    if (!isWithinBusinessHours(start)) {
      return `In time must be between ${BUSINESS_OPEN} and ${BUSINESS_CLOSE}`;
    }

    if (!isWithinBusinessHours(end)) {
      return `Out time must be between ${BUSINESS_OPEN} and ${BUSINESS_CLOSE}`;
    }

    // Check minimum 2 hours duration
    const startTime = new Date(`2000-01-01T${start}`);
    const endTime = new Date(`2000-01-01T${end}`);
    const durationHours =
      (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);

    if (durationHours < 2) {
      return "Minimum booking duration is 2 hours";
    }

    // Check for overlapping with booked slots
    if (isSlotOverlapping(start, end)) {
      return "Selected time overlaps with existing booking";
    }

    // Check if time is in past
    if (isTimeInPast()) {
      return "Cannot book time in the past";
    }

    return null;
  };

  const handleFullDayToggle = () => {
    if (canBookFullDay()) {
      setIsFullDay(!isFullDay);
    } else {
      toast.error("Cannot book full day - there are existing bookings");
    }
  };

  const handleInTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newInTime = e.target.value;
    setInTime(newInTime);

    // Auto-adjust out time if it becomes invalid
    if (newInTime >= outTime) {
      const newInTimeDate = new Date(`2000-01-01T${newInTime}`);
      newInTimeDate.setHours(newInTimeDate.getHours() + 2); // Add 2 hours minimum

      const newOutTime = newInTimeDate.toTimeString().slice(0, 5);

      // Ensure out time doesn't exceed business closing time
      if (newOutTime <= BUSINESS_CLOSE) {
        setOutTime(newOutTime);
      } else {
        setOutTime(BUSINESS_CLOSE);
      }
    }
  };

  const handleOutTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newOutTime = e.target.value;

    // Don't allow out time beyond business hours
    if (newOutTime > BUSINESS_CLOSE) {
      toast.error(`Booking cannot extend beyond ${BUSINESS_CLOSE}`);
      setOutTime(BUSINESS_CLOSE);
      return;
    }

    setOutTime(newOutTime);
  };

  const isPastDate = (): boolean => {
    if (!selectedDate) return true;

    const today = new Date();
    const selectedDateTime = new Date();
    selectedDateTime.setFullYear(today.getFullYear());
    selectedDateTime.setMonth(today.getMonth());
    selectedDateTime.setDate(selectedDate);
    selectedDateTime.setHours(0, 0, 0, 0);

    const todayDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    return selectedDateTime < todayDate;
  };

  // Get available time options for dropdown (if you were using select instead of time input)
  const getAvailableTimeOptions = () => {
    const options = [];
    for (let hour = 8; hour <= 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        // 30-minute intervals
        const timeString = `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}`;
        options.push(timeString);
      }
    }
    return options;
  };

  if (isPastDate()) {
    return (
      <div className="w-full">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Time Selection
          </h3>
          <div className="text-center py-8 bg-gray-100 rounded-lg">
            <p className="text-gray-600">Cannot book past dates</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-full bg-gray-400 text-white font-semibold py-3 rounded-lg transition"
        >
          Close
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Time Selection<span className="text-red-500">*</span>
        </h3>

        {/* Business Hours Notice */}
        <div className="bg-blue-50 border border-blue-200 text-blue-700 py-2 px-3 rounded text-sm mb-4">
          <p className="font-medium">
            📅 Business Hours: {BUSINESS_OPEN} A.M. - {BUSINESS_CLOSE} P.M.
          </p>
          <p className="text-xs mt-1">
            Bookings are only available during these hours
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-orange-500 mx-auto"></div>
            <p className="text-gray-600 mt-2">Checking availability...</p>
          </div>
        ) : (
          <>
            {/* Full Day Option */}
            <div className="mb-6">
              <button
                onClick={handleFullDayToggle}
                disabled={!canBookFullDay()}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
                  isFullDay
                    ? "bg-orange-500 text-white shadow-md"
                    : canBookFullDay()
                    ? "border border-gray-300 text-gray-700 hover:border-orange-500"
                    : "border border-gray-300 text-gray-400 bg-gray-100 cursor-not-allowed"
                }`}
              >
                {canBookFullDay() ? "Book Full Day" : "Full Day Unavailable"}
                {!canBookFullDay() && (
                  <span className="block text-xs mt-1 text-gray-500">
                    (Existing bookings present)
                  </span>
                )}
              </button>
            </div>

            {/* Time Slots - ALWAYS VISIBLE */}
            <div className="space-y-4">
              {/* In Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  In Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  value={inTime}
                  onChange={handleInTimeChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                  min={BUSINESS_OPEN}
                  max={BUSINESS_CLOSE}
                  disabled={isFullDay}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Must be between {BUSINESS_OPEN} - {BUSINESS_CLOSE}
                </p>
              </div>

              {/* Out Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Out Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  value={outTime}
                  onChange={handleOutTimeChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                  min={BUSINESS_OPEN}
                  max={BUSINESS_CLOSE}
                  disabled={isFullDay}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Must be between {BUSINESS_OPEN} - {BUSINESS_CLOSE}
                </p>
              </div>

              {/* Booked Slots Display */}
              {bookedSlots.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Already Booked Slots:
                  </h4>
                  <div className="space-y-2">
                    {bookedSlots.map((slot, index) => (
                      <div
                        key={index}
                        className="bg-red-100 border border-red-300 text-red-700 py-2 px-3 rounded text-sm"
                      >
                        {slot.startTime} - {slot.endTime}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Please select a time slot that doesn't overlap with existing
                    bookings
                  </p>
                </div>
              )}

              {/* Validation Message */}
              {validateTimeSelection() && !isFullDay && (
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 py-2 px-3 rounded text-sm">
                  {validateTimeSelection()}
                </div>
              )}
            </div>

            {/* Full Day Validation Message */}
            {isFullDay && !canBookFullDay() && (
              <div className="bg-red-50 border border-red-200 text-red-700 py-3 px-4 rounded text-sm mt-4">
                Cannot book full day because there are existing bookings for
                this date. Please use custom time slots instead.
              </div>
            )}

            {/* Full Day Selected Info */}
            {isFullDay && canBookFullDay() && (
              <div className="bg-green-50 border border-green-200 text-green-700 py-3 px-4 rounded text-sm mt-4">
                ✅ Full day booking selected ({BUSINESS_OPEN} - {BUSINESS_CLOSE}
                )
              </div>
            )}
          </>
        )}
      </div>

      <div className="space-y-3">
        <button
          onClick={() => {
            if (isFullDay) {
              if (!canBookFullDay()) {
                toast.error(
                  "Full day booking not available due to existing bookings"
                );
                return;
              }
              onTimeSlotConfirm({
                startTime: BUSINESS_OPEN,
                endTime: BUSINESS_CLOSE,
                isFullDay: true,
              });
            } else {
              const validationError = validateTimeSelection();
              if (validationError) {
                toast.error(validationError);
                return;
              }
              onTimeSlotConfirm({
                startTime: inTime,
                endTime: outTime,
                isFullDay: false,
              });
            }
          }}
          disabled={isLoading || !!validateTimeSelection()}
          className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition"
        >
          {isFullDay ? "Book Now" : "Confirm Time Slot"}
        </button>

        <button
          onClick={onClose}
          className="w-full border border-gray-300 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-50 transition"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default TimeSlots;
