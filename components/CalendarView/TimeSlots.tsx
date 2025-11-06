import React, { useEffect, useState } from "react";
import { TimeSlotsProps } from "./types";
import { bookingService } from "@/services/bookingService";
import toast from "react-hot-toast";
import CustomTimeModal from "./CustomTimeModal";

interface TimeSlot {
  startTime: string;
  endTime: string;
  available: boolean;
}

const TimeSlots: React.FC<TimeSlotsProps> = ({
  onClose,
  selectedDate,
  selectedRoomId,
  onTimeSlotConfirm,
}) => {
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [showCustomTime, setShowCustomTime] = useState(false);
  const [isFullDay, setIsFullDay] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadAvailableSlots = async () => {
      if (!selectedRoomId || selectedDate === null) return;

      setIsLoading(true);
      try {
        // Convert day number to YYYY-MM-DD format
        const today = new Date();
        const monthIndex = today.getMonth();
        const currentYear = today.getFullYear();

        // Get the month/year from the calendar component context
        // For now, use current month. This should ideally come from parent
        const month = String(monthIndex + 1).padStart(2, "0");
        const dayStr = String(selectedDate).padStart(2, "0");
        const bookingDate = `${currentYear}-${month}-${dayStr}`;

        console.log("Loading slots for date:", bookingDate);

        const result = await bookingService.checkAvailability(
          selectedRoomId,
          bookingDate
        );

        console.log("Availability result:", result);

        if (result.type === "fully_booked") {
          toast.error("This room is fully booked for this day.");
          setAvailableSlots([]);
          return;
        }

        if (result.type === "partially_booked" && result.bookedRanges) {
          const workingHours = [
            { startTime: "08:00", endTime: "10:00" },
            { startTime: "10:00", endTime: "12:00" },
            { startTime: "12:00", endTime: "14:00" },
            { startTime: "14:00", endTime: "16:00" },
            { startTime: "16:00", endTime: "18:00" },
          ];

          const slots: TimeSlot[] = workingHours.map((slot) => {
            const isAvailable = !result.bookedRanges.some(
              (range: any) =>
                !(
                  slot.endTime <= range.startTime ||
                  slot.startTime >= range.endTime
                )
            );

            return {
              ...slot,
              available: isAvailable,
            };
          });

          setAvailableSlots(slots);
        } else {
          const slots: TimeSlot[] = [
            { startTime: "08:00", endTime: "10:00", available: true },
            { startTime: "10:00", endTime: "12:00", available: true },
            { startTime: "12:00", endTime: "14:00", available: true },
            { startTime: "14:00", endTime: "16:00", available: true },
            { startTime: "16:00", endTime: "18:00", available: true },
          ];
          setAvailableSlots(slots);
        }
      } catch (error) {
        console.error("Error loading available slots:", error);
        toast.error("Failed to load available time slots");
      } finally {
        setIsLoading(false);
      }
    };

    loadAvailableSlots();
  }, [selectedRoomId, selectedDate]);

  const handleConfirm = async () => {
    if (!isFullDay && !selectedSlot) {
      toast.error("Please select a time slot");
      return;
    }

    if (isFullDay) {
      onTimeSlotConfirm({
        startTime: "00:00",
        endTime: "23:59",
        isFullDay: true,
      });
    } else if (selectedSlot) {
      const [startTime, endTime] = selectedSlot.split(" - ");
      onTimeSlotConfirm({
        startTime: startTime.trim(),
        endTime: endTime.trim(),
        isFullDay: false,
      });
    }
  };

  const handleCustomTimeConfirm = (inTime: string, outTime: string) => {
    onTimeSlotConfirm({
      startTime: inTime,
      endTime: outTime,
      isFullDay: false,
    });
    setShowCustomTime(false);
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Time Slots<span className="text-red-500">*</span>
        </h3>

        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-orange-500 mx-auto"></div>
            <p className="text-gray-600 mt-2">Loading available slots...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {availableSlots.map((slot, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setIsFullDay(false);
                    setSelectedSlot(`${slot.startTime} - ${slot.endTime}`);
                  }}
                  disabled={!slot.available}
                  className={`py-3 px-4 rounded-lg font-medium transition-all ${
                    selectedSlot === `${slot.startTime} - ${slot.endTime}` &&
                    !isFullDay
                      ? "bg-orange-500 text-white shadow-md"
                      : slot.available
                      ? "border border-gray-300 text-gray-700 hover:border-orange-500"
                      : "bg-red-100 border border-red-300 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {slot.startTime} - {slot.endTime}
                </button>
              ))}

              <button
                onClick={() => setIsFullDay(!isFullDay)}
                className={`py-3 px-4 rounded-lg font-medium transition-all col-span-2 ${
                  isFullDay
                    ? "bg-orange-500 text-white shadow-md"
                    : "border border-gray-300 text-gray-700 hover:border-orange-500"
                }`}
              >
                Full Day
              </button>

              <button
                onClick={() => setShowCustomTime(true)}
                className="py-3 px-4 rounded-lg font-medium transition-all col-span-2 border-2 border-dashed border-orange-300 text-orange-600 hover:border-orange-500"
              >
                + Custom Time Slot
              </button>
            </div>
          </>
        )}
      </div>

      <button
        onClick={handleConfirm}
        disabled={!isFullDay && !selectedSlot}
        className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition"
      >
        Confirm Selection
      </button>

      {showCustomTime && (
        <CustomTimeModal
          onClose={() => setShowCustomTime(false)}
          onConfirm={handleCustomTimeConfirm}
        />
      )}
    </div>
  );
};

export default TimeSlots;
