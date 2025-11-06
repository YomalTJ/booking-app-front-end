import Booking from "@/models/Booking";

interface TimeRange {
  startTime: string;
  endTime: string;
}

interface AvailabilityResult {
  isAvailable: boolean;
  type: "available" | "fully_booked" | "partially_booked" | "unavailable";
  bookedRanges?: TimeRange[];
  message: string;
}

const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

const timeRangesOverlap = (
  start1: string,
  end1: string,
  start2: string,
  end2: string
): boolean => {
  const start1Min = timeToMinutes(start1);
  const end1Min = timeToMinutes(end1);
  const start2Min = timeToMinutes(start2);
  const end2Min = timeToMinutes(end2);

  return start1Min < end2Min && start2Min < end1Min;
};

export const getBookingsForDate = async (
  roomId: string,
  bookingDate: string | Date
): Promise<any[]> => {
  try {
    let dateObj: Date;

    if (typeof bookingDate === "string") {
      // Parse YYYY-MM-DD format properly
      const [yearStr, monthStr, dayStr] = bookingDate.split("-");
      const year = parseInt(yearStr, 10);
      const month = parseInt(monthStr, 10);
      const day = parseInt(dayStr, 10);

      // Create UTC date at midnight
      dateObj = new Date(Date.UTC(year, month - 1, day));
    } else {
      dateObj = new Date(bookingDate);
      // Set to UTC midnight
      dateObj = new Date(
        Date.UTC(
          dateObj.getUTCFullYear(),
          dateObj.getUTCMonth(),
          dateObj.getUTCDate()
        )
      );
    }

    const endOfDay = new Date(dateObj);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const bookings = await Booking.find({
      roomId,
      bookingDate: {
        $gte: dateObj,
        $lt: endOfDay,
      },
      status: { $in: ["active", "completed"] },
    });

    return bookings;
  } catch (error) {
    console.error("Error in getBookingsForDate:", error);
    throw error;
  }
};

export const checkTimeSlotAvailability = async (
  roomId: string,
  bookingDate: string | Date,
  startTime: string,
  endTime: string,
  excludeBookingId?: string
): Promise<AvailabilityResult> => {
  try {
    const bookings = await getBookingsForDate(roomId, bookingDate);

    const activeBookings = excludeBookingId
      ? bookings.filter((b) => b._id.toString() !== excludeBookingId)
      : bookings;

    const fullDayBooking = activeBookings.find((b) => b.isFullDayBooking);
    if (fullDayBooking) {
      return {
        isAvailable: false,
        type: "fully_booked",
        message: "This room is fully booked for the entire day.",
      };
    }

    const overlappingBookings = activeBookings.filter((booking) =>
      timeRangesOverlap(startTime, endTime, booking.startTime, booking.endTime)
    );

    if (overlappingBookings.length > 0) {
      const bookedRanges = overlappingBookings.map((b) => ({
        startTime: b.startTime,
        endTime: b.endTime,
      }));

      return {
        isAvailable: false,
        type: "partially_booked",
        bookedRanges,
        message: `Time slot conflicts with existing bookings: ${bookedRanges
          .map((r) => `${r.startTime}-${r.endTime}`)
          .join(", ")}`,
      };
    }

    return {
      isAvailable: true,
      type: "available",
      message: "Time slot is available.",
    };
  } catch (error: any) {
    console.error("Error checking time slot availability:", error);
    return {
      isAvailable: false,
      type: "unavailable",
      message: `Error checking availability: ${error.message}`,
    };
  }
};

export const getDayAvailabilityStatus = async (
  roomId: string,
  bookingDate: string | Date
): Promise<AvailabilityResult> => {
  try {
    const bookings = await getBookingsForDate(roomId, bookingDate);

    const fullDayBooking = bookings.find((b) => b.isFullDayBooking);
    if (fullDayBooking) {
      return {
        isAvailable: false,
        type: "fully_booked",
        message: "This room is fully booked for the entire day.",
      };
    }

    const bookedRanges = bookings.map((b) => ({
      startTime: b.startTime,
      endTime: b.endTime,
    }));

    if (bookedRanges.length > 0) {
      return {
        isAvailable: true,
        type: "partially_booked",
        bookedRanges,
        message: `Some time slots are booked: ${bookedRanges
          .map((r) => `${r.startTime}-${r.endTime}`)
          .join(", ")}`,
      };
    }

    return {
      isAvailable: true,
      type: "available",
      message: "The entire day is available.",
    };
  } catch (error: any) {
    console.error("Error getting day availability status:", error);
    return {
      isAvailable: false,
      type: "unavailable",
      message: `Error checking availability: ${error.message}`,
    };
  }
};

export const getAvailableTimeSlots = async (
  roomId: string,
  bookingDate: string | Date
): Promise<TimeRange[]> => {
  const bookings = await getBookingsForDate(roomId, bookingDate);

  if (bookings.some((b) => b.isFullDayBooking)) {
    return [];
  }

  const workingHours = [
    { startTime: "08:00", endTime: "10:00" },
    { startTime: "10:00", endTime: "12:00" },
    { startTime: "12:00", endTime: "14:00" },
    { startTime: "14:00", endTime: "16:00" },
    { startTime: "16:00", endTime: "18:00" },
  ];

  return workingHours.filter((slot) => {
    const hasConflict = bookings.some((booking) =>
      timeRangesOverlap(
        slot.startTime,
        slot.endTime,
        booking.startTime,
        booking.endTime
      )
    );
    return !hasConflict;
  });
};
