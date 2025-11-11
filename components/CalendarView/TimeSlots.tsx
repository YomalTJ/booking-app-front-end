import React, { useEffect, useState } from "react";
import { TimeSlotsProps } from "./types";
import { bookingService } from "@/services/bookingService";
import toast from "react-hot-toast";
import VerificationModal from "./VerificationModal";

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
  const [outTime, setOutTime] = useState<string>("10:00");
  const [bookedSlots, setBookedSlots] = useState<BookedSlot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFullDay, setIsFullDay] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [pendingBookingData, setPendingBookingData] = useState<{
    startTime: string;
    endTime: string;
    isFullDay: boolean;
  } | null>(null);

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

  const generateTimeOptions = () => {
    const options: string[] = [];
    for (let hour = 8; hour <= 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        if (hour === 18 && minute > 0) break; // Stop at 18:00

        const time24 = `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}`;

        // Convert to 12-hour format for display
        const displayHour = hour > 12 ? hour - 12 : hour;
        const ampm = hour >= 12 ? "pm" : "am";
        const displayTime =
          minute === 0
            ? `${displayHour}${ampm}`
            : `${displayHour}:${minute.toString().padStart(2, "0")}${ampm}`;

        options.push(time24);
      }
    }
    return options;
  };

  const handleVerificationConfirm = () => {
    if (pendingBookingData) {
      onTimeSlotConfirm(pendingBookingData);
      setShowVerification(false);
      setPendingBookingData(null);
    }
  };

  const formatTimeTo12h = (time24: string): string => {
    const [hours, minutes] = time24.split(":").map(Number);
    const ampm = hours >= 12 ? "PM" : "AM";
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes.toString().padStart(2, "0");
    // Use padEnd to ensure AM/PM alignment (add spaces before AM/PM to align)
    const timeWithoutAmPm = `${displayHours
      .toString()
      .padStart(2, "0")}:${displayMinutes}`;
    return `${timeWithoutAmPm} ${ampm}`;
  };

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

  const isUserAuthenticated = (): boolean => {
    const token = localStorage.getItem("token");
    return !!token; // Returns true if token exists, false otherwise
  };

  // Check if time is within business hours
  const isWithinBusinessHours = (time: string): boolean => {
    const timeToMinutes = (timeStr: string) => {
      const [hours, minutes] = timeStr.split(":").map(Number);
      return hours * 60 + minutes;
    };

    const timeInMinutes = timeToMinutes(time);
    const openInMinutes = timeToMinutes(BUSINESS_OPEN);
    const closeInMinutes = timeToMinutes(BUSINESS_CLOSE);

    return timeInMinutes >= openInMinutes && timeInMinutes <= closeInMinutes;
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
      return "Check-out time must be later than check-in time";
    }

    // Check if times are within business hours (8 AM - 6 PM)
    if (!isWithinBusinessHours(start)) {
      return `Check-in time must be between ${BUSINESS_OPEN} AM and ${BUSINESS_CLOSE} PM`;
    }

    if (!isWithinBusinessHours(end)) {
      return `Check-out time must be between ${BUSINESS_OPEN} AM and ${BUSINESS_CLOSE} PM`;
    }

    // Check minimum 2 hours duration
    const startTime = new Date(`2000-01-01T${start}`);
    const endTime = new Date(`2000-01-01T${end}`);
    const durationHours =
      (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);

    if (durationHours < 2) {
      return "Minimum booking duration is 2 hours.";
    }

    // Check for overlapping with booked slots
    if (isSlotOverlapping(start, end)) {
      const overlappingSlot = bookedSlots.find(
        (booked) => !(end <= booked.startTime || start >= booked.endTime)
      );

      if (overlappingSlot) {
        return `Time slot conflicts with existing booking (${overlappingSlot.startTime} - ${overlappingSlot.endTime})`;
      }
      return "Selected time overlaps with an existing booking";
    }

    // Check if time is in past
    if (isTimeInPast()) {
      return "Cannot book time in the past. Please select a future time.";
    }

    return null;
  };

  const handleFullDayToggle = () => {
    if (canBookFullDay()) {
      setIsFullDay(!isFullDay);
    } else {
      toast.error("Full day booking unavailable - existing bookings present");
    }
  };

  const getSelectedDateString = (): string => {
    if (!selectedDate) return "";

    const today = new Date();
    const monthIndex = today.getMonth();
    const currentYear = today.getFullYear();

    const month = String(monthIndex + 1).padStart(2, "0");
    const dayStr = String(selectedDate).padStart(2, "0");

    return `${currentYear}-${month}-${dayStr}`;
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
        toast.success(
          "Check-out time automatically adjusted to meet 2-hour minimum"
        );
      } else {
        setOutTime(BUSINESS_CLOSE);
        toast.success("Check-out time set to business closing time");
      }
    }
  };

  const handleOutTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newOutTime = e.target.value;

    // Don't allow out time beyond business hours
    if (newOutTime > BUSINESS_CLOSE) {
      toast.error(`Booking cannot extend beyond ${BUSINESS_CLOSE} PM`);
      setOutTime(BUSINESS_CLOSE);
      return;
    }

    // Check if duration is less than 2 hours
    const startTime = new Date(`2000-01-01T${inTime}`);
    const endTime = new Date(`2000-01-01T${newOutTime}`);
    const durationHours =
      (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);

    if (durationHours < 2) {
      toast.error("Minimum booking duration is 2 hours");
      return;
    }

    setOutTime(newOutTime);
  };

  const getMinimumCheckoutTime = (checkInTime: string): string => {
    const [hours, minutes] = checkInTime.split(":").map(Number);
    const checkInDate = new Date(`2000-01-01T${checkInTime}`);
    checkInDate.setHours(hours + 2); // Add 2 hours minimum
    return checkInDate.toTimeString().slice(0, 5);
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
            <p className="text-sm text-gray-500 mt-2">
              Please select today or a future date
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-full bg-gray-400 text-white font-semibold py-3 rounded-lg transition hover:bg-gray-500"
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
          Select Your Time Slot<span className="text-red-500">*</span>
        </h3>

        {/* Business Hours Notice */}
        <div className="bg-blue-50 border border-blue-200 text-blue-700 py-3 px-4 rounded-lg text-sm mb-4">
          <p className="font-medium flex items-center gap-2">
            <span>📅</span>
            Business Hours: {BUSINESS_OPEN} AM - {BUSINESS_CLOSE} PM
          </p>
          <p className="text-xs mt-2 text-blue-600">
            • Minimum booking duration: 2 hours
            <br />
            • All times are in 24-hour format
            <br />• Bookings must be within business hours
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-orange-500 mx-auto"></div>
            <p className="text-gray-600 mt-2">Checking availability...</p>
            <p className="text-sm text-gray-500 mt-1">
              Loading available time slots
            </p>
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
                    ? "border-2 border-gray-300 text-gray-700 hover:border-orange-500 hover:bg-orange-50"
                    : "border border-gray-300 text-gray-400 bg-gray-100 cursor-not-allowed"
                }`}
              >
                <div className="flex flex-col items-center">
                  <span className="font-semibold">
                    {canBookFullDay()
                      ? "📅 Book Full Day"
                      : "🚫 Full Day Unavailable"}
                  </span>
                  {!canBookFullDay() && (
                    <span className="text-xs mt-1 text-gray-500">
                      (Existing bookings on this date)
                    </span>
                  )}
                  {canBookFullDay() && !isFullDay && (
                    <span className="text-xs mt-1 text-gray-600">
                      {BUSINESS_OPEN} AM - {BUSINESS_CLOSE} PM
                    </span>
                  )}
                </div>
              </button>
            </div>

            {/* Time Slots - ALWAYS VISIBLE */}
            <div className="space-y-4">
              {/* In Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Check-in Time <span className="text-red-500">*</span>
                </label>
                <select
                  value={inTime}
                  onChange={(e) => {
                    const newInTime = e.target.value;
                    setInTime(newInTime);

                    // Auto-adjust out time if it becomes invalid (less than 2 hours from new check-in)
                    const minCheckoutTime = getMinimumCheckoutTime(newInTime);
                    if (outTime < minCheckoutTime) {
                      setOutTime(minCheckoutTime);
                    }
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition bg-white text-base appearance-none cursor-pointer font-mono"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M10.293 3.293L6 7.586 1.707 3.293A1 1 0 00.293 4.707l5 5a1 1 0 001.414 0l5-5a1 1 0 10-1.414-1.414z'/%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 1rem center",
                    backgroundSize: "12px",
                    paddingRight: "2.5rem",
                  }}
                  disabled={isFullDay}
                >
                  {generateTimeOptions().map((time) => (
                    <option key={time} value={time} className="py-2 font-mono">
                      {formatTimeTo12h(time)}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Start time for your booking
                </p>
              </div>

              {/* Out Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Check-out Time <span className="text-red-500">*</span>
                </label>
                <select
                  value={outTime}
                  onChange={(e) => setOutTime(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition bg-white text-base appearance-none cursor-pointer font-mono"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M10.293 3.293L6 7.586 1.707 3.293A1 1 0 00.293 4.707l5 5a1 1 0 001.414 0l5-5a1 1 0 10-1.414-1.414z'/%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 1rem center",
                    backgroundSize: "12px",
                    paddingRight: "2.5rem",
                  }}
                  disabled={isFullDay}
                >
                  {generateTimeOptions()
                    .filter((time) => {
                      const minCheckoutTime = getMinimumCheckoutTime(inTime);
                      return time >= minCheckoutTime;
                    })
                    .map((time) => (
                      <option
                        key={time}
                        value={time}
                        className="py-2 font-mono"
                      >
                        {formatTimeTo12h(time)}
                      </option>
                    ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  End time for your booking (minimum 2 hours from check-in)
                </p>
              </div>

              {/* Duration Info */}
              {!isFullDay && inTime && outTime && (
                <div className="bg-green-50 border border-green-200 text-green-700 py-2 px-3 rounded text-sm">
                  <div className="flex justify-between items-center">
                    <span>Selected Duration:</span>
                    <span className="font-semibold">
                      {(() => {
                        const start = new Date(`2000-01-01T${inTime}`);
                        const end = new Date(`2000-01-01T${outTime}`);
                        const hours =
                          (end.getTime() - start.getTime()) / (1000 * 60 * 60);
                        return `${hours.toFixed(1)} hours`;
                      })()}
                    </span>
                  </div>
                </div>
              )}

              {/* Booked Slots Display */}
              {bookedSlots.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <span>⏰</span>
                    Already Booked Time Slots:
                  </h4>
                  <div className="space-y-2">
                    {bookedSlots.map((slot, index) => (
                      <div
                        key={index}
                        className="bg-red-50 border border-red-200 text-red-700 py-2 px-3 rounded text-sm"
                      >
                        <div className="flex justify-between items-center">
                          <span>
                            {slot.startTime} - {slot.endTime}
                          </span>
                          <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                            Booked
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    💡 Please select a time slot that doesn't overlap with these
                    bookings
                  </p>
                </div>
              )}

              {/* Validation Message */}
              {/* {validateTimeSelection() && !isFullDay && (
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 py-3 px-4 rounded-lg text-sm">
                  <div className="flex items-start gap-2">
                    <span>⚠️</span>
                    <div>
                      <p className="font-medium">
                        Please adjust your time selection:
                      </p>
                      <p className="mt-1">{validateTimeSelection()}</p>
                    </div>
                  </div>
                </div>
              )} */}
            </div>

            {/* Full Day Validation Message */}
            {isFullDay && !canBookFullDay() && (
              <div className="bg-red-50 border border-red-200 text-red-700 py-3 px-4 rounded-lg text-sm mt-4">
                <div className="flex items-start gap-2">
                  <span>🚫</span>
                  <div>
                    <p className="font-medium">Full day booking unavailable</p>
                    <p className="mt-1">
                      Cannot book full day because there are existing bookings
                      for this date. Please use custom time slots instead.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Full Day Selected Info */}
            {isFullDay && canBookFullDay() && (
              <div className="bg-green-50 border border-green-200 text-green-700 py-3 px-4 rounded-lg text-sm mt-4">
                <div className="flex items-center gap-2">
                  <span>✅</span>
                  <div>
                    <p className="font-medium">Full day booking selected</p>
                    <p className="text-sm">
                      {BUSINESS_OPEN} AM - {BUSINESS_CLOSE} PM (All day)
                    </p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <div className="space-y-3">
        <button
          onClick={() => {
            // Check authentication first
            if (!isUserAuthenticated()) {
              toast.error("Please log in to create a booking", {
                style: {
                  background: "#fef2f2",
                  color: "#991b1b",
                  border: "1px solid #fecaca",
                },
                icon: "🔒",
                duration: 4000,
              });
              return;
            }

            if (isFullDay) {
              if (!canBookFullDay()) {
                toast.error(
                  "Full day booking not available due to existing bookings"
                );
                return;
              }
              // Show verification modal for full day booking
              setPendingBookingData({
                startTime: BUSINESS_OPEN,
                endTime: BUSINESS_CLOSE,
                isFullDay: true,
              });
              setShowVerification(true);
            } else {
              const validationError = validateTimeSelection();
              if (validationError) {
                // Show red error toast for validation errors
                toast.error(validationError, {
                  style: {
                    background: "#fee2e2",
                    color: "#dc2626",
                    border: "1px solid #fecaca",
                  },
                  icon: "❌",
                });
                return;
              }
              // Show verification modal for time slot booking
              setPendingBookingData({
                startTime: inTime,
                endTime: outTime,
                isFullDay: false,
              });
              setShowVerification(true);
            }
          }}
          disabled={isLoading}
          className="w-full cursor-pointer bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition transform hover:scale-[1.02] disabled:hover:scale-100"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Processing...
            </div>
          ) : isFullDay ? (
            "Confirm Book Full Day"
          ) : (
            "Confirm Time Slot"
          )}
        </button>

        <button
          onClick={onClose}
          className="w-full border-2 border-gray-300 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-50 transition transform hover:scale-[1.02] cursor-pointer"
        >
          Cancel
        </button>
      </div>

      {pendingBookingData && (
        <VerificationModal
          isOpen={showVerification}
          onClose={() => {
            setShowVerification(false);
            setPendingBookingData(null);
          }}
          onConfirm={handleVerificationConfirm}
          bookingDetails={{
            date: getSelectedDateString(),
            startTime: pendingBookingData.startTime,
            endTime: pendingBookingData.endTime,
            isFullDay: pendingBookingData.isFullDay,
            duration: pendingBookingData.isFullDay
              ? "Full Day"
              : `${(() => {
                  const start = new Date(
                    `2000-01-01T${pendingBookingData.startTime}`
                  );
                  const end = new Date(
                    `2000-01-01T${pendingBookingData.endTime}`
                  );
                  const hours =
                    (end.getTime() - start.getTime()) / (1000 * 60 * 60);
                  return `${hours.toFixed(1)} hours`;
                })()}`,
          }}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

export default TimeSlots;
