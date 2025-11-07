export interface TimeRemaining {
  hours: number;
  minutes: number;
  totalMinutes: number;
  isPast: boolean;
  isActive: boolean;
  formatted: string;
}

export const calculateTimeRemaining = (
  bookingDate: string,
  startTime: string,
  endTime: string,
  isFullDay: boolean = false
): TimeRemaining => {
  const now = new Date();

  // Parse booking date and times
  const [year, month, day] = bookingDate.split("-").map(Number);
  const [startHours, startMinutes] = startTime.split(":").map(Number);
  const [endHours, endMinutes] = endTime.split(":").map(Number);

  // Create date objects for start and end times
  const startDateTime = new Date(
    year,
    month - 1,
    day,
    startHours,
    startMinutes
  );
  const endDateTime = new Date(year, month - 1, day, endHours, endMinutes);

  let timeRemaining: TimeRemaining = {
    hours: 0,
    minutes: 0,
    totalMinutes: 0,
    isPast: false,
    isActive: false,
    formatted: "",
  };

  if (now < startDateTime) {
    // Booking is in the future
    const diffMs = startDateTime.getTime() - now.getTime();
    const totalMinutes = Math.floor(diffMs / (1000 * 60));

    timeRemaining = {
      hours: Math.floor(totalMinutes / 60),
      minutes: totalMinutes % 60,
      totalMinutes,
      isPast: false,
      isActive: false,
      formatted: `Starts in ${Math.floor(totalMinutes / 60)}h ${
        totalMinutes % 60
      }m`,
    };
  } else if (now >= startDateTime && now <= endDateTime) {
    // Booking is currently active
    const diffMs = endDateTime.getTime() - now.getTime();
    const totalMinutes = Math.max(0, Math.floor(diffMs / (1000 * 60)));

    timeRemaining = {
      hours: Math.floor(totalMinutes / 60),
      minutes: totalMinutes % 60,
      totalMinutes,
      isPast: false,
      isActive: true,
      formatted: `${Math.floor(totalMinutes / 60)}h ${
        totalMinutes % 60
      }m remaining`,
    };
  } else {
    // Booking is in the past
    timeRemaining = {
      hours: 0,
      minutes: 0,
      totalMinutes: 0,
      isPast: true,
      isActive: false,
      formatted: "Completed",
    };
  }

  return timeRemaining;
};

export const getBookingDuration = (
  startTime: string,
  endTime: string
): string => {
  const [startHours, startMinutes] = startTime.split(":").map(Number);
  const [endHours, endMinutes] = endTime.split(":").map(Number);

  const startTotalMinutes = startHours * 60 + startMinutes;
  const endTotalMinutes = endHours * 60 + endMinutes;
  const durationMinutes = endTotalMinutes - startTotalMinutes;

  const hours = Math.floor(durationMinutes / 60);
  const minutes = durationMinutes % 60;

  if (hours > 0 && minutes > 0) {
    return `${hours}h ${minutes}m`;
  } else if (hours > 0) {
    return `${hours}h`;
  } else {
    return `${minutes}m`;
  }
};

export const isBookingToday = (bookingDate: string): boolean => {
  const today = new Date();
  const booking = new Date(bookingDate);

  return today.toDateString() === booking.toDateString();
};
