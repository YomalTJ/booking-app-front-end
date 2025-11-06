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

  const handleConfirm = async () => {
    if (isFullDay) {
      if (!canBookFullDay()) {
        toast.error("Full day booking not available due to existing bookings");
        return;
      }

      onTimeSlotConfirm({
        startTime: "00:00",
        endTime: "23:59",
        isFullDay: true,
      });
      return;
    }

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

            {!isFullDay && (
              <div className="space-y-4">
                {/* In Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    In Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    value={inTime}
                    onChange={(e) => setInTime(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                    min="08:00"
                    max="18:00"
                  />
                </div>

                {/* Out Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Out Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    value={outTime}
                    onChange={(e) => setOutTime(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                    min="10:00"
                    max="20:00"
                  />
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
                      Please select a time slot that doesn't overlap with
                      existing bookings
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
            )}

            {/* Full Day Validation Message */}
            {isFullDay && !canBookFullDay() && (
              <div className="bg-red-50 border border-red-200 text-red-700 py-3 px-4 rounded text-sm mt-4">
                Cannot book full day because there are existing bookings for
                this date. Please use custom time slots instead.
              </div>
            )}
          </>
        )}
      </div>

      <div className="space-y-3">
        <button
          onClick={handleConfirm}
          disabled={isLoading || !!validateTimeSelection()}
          className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition"
        >
          {isFullDay ? "Book Full Day" : "Confirm Selection"}
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
