export interface TimeRemaining {
  hours: number;
  minutes: number;
  totalMinutes: number;
  isPast: boolean;
  isActive: boolean;
  formatted: string;
}

export const calculateTimeRemaining = (
  bookingDate: string, // YYYY-MM-DD format
  startTime: string, // HH:MM format (24-hour)
  endTime: string, // HH:MM format (24-hour)
  isFullDay: boolean = false
): TimeRemaining => {
  const now = new Date();

  // Parse booking date and times
  const [year, month, day] = bookingDate.split("-").map(Number);
  const [startHours, startMinutes] = startTime.split(":").map(Number);
  const [endHours, endMinutes] = endTime.split(":").map(Number);

  // Create date objects using the same date (today) for comparison
  const today = new Date();
  const startDateTime = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    startHours,
    startMinutes
  );
  const endDateTime = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    endHours,
    endMinutes
  );

  // Debug logs
  console.log("=== TIME CALCULATION DEBUG ===");
  console.log("Current time:", now.toString());
  console.log("Current time (HH:MM):", now.getHours() + ":" + now.getMinutes());
  console.log("Booking start:", startDateTime.toString());
  console.log("Booking end:", endDateTime.toString());
  console.log("Start time:", startTime, "End time:", endTime);
  console.log("Is now >= start?", now >= startDateTime);
  console.log("Is now <= end?", now <= endDateTime);
  console.log("=== END DEBUG ===");

  // Convert to minutes since midnight for simpler comparison
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const startMinutesTotal = startHours * 60 + startMinutes;
  const endMinutesTotal = endHours * 60 + endMinutes;

  console.log(
    "Time in minutes - Now:",
    nowMinutes,
    "Start:",
    startMinutesTotal,
    "End:",
    endMinutesTotal
  );

  let timeRemaining: TimeRemaining = {
    hours: 0,
    minutes: 0,
    totalMinutes: 0,
    isPast: false,
    isActive: false,
    formatted: "",
  };

  if (nowMinutes < startMinutesTotal) {
    // Booking is in the future (today)
    const totalMinutes = startMinutesTotal - nowMinutes;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    timeRemaining = {
      hours,
      minutes,
      totalMinutes,
      isPast: false,
      isActive: false,
      formatted: `Starts in ${hours}h ${minutes}m`,
    };
  } else if (nowMinutes >= startMinutesTotal && nowMinutes <= endMinutesTotal) {
    // Booking is currently active
    const totalMinutes = endMinutesTotal - nowMinutes;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    timeRemaining = {
      hours,
      minutes,
      totalMinutes,
      isPast: false,
      isActive: true,
      formatted: `${hours}h ${minutes}m remaining`,
    };
  } else if (nowMinutes > endMinutesTotal) {
    // Booking is in the past (completed today)
    timeRemaining = {
      hours: 0,
      minutes: 0,
      totalMinutes: 0,
      isPast: true,
      isActive: false,
      formatted: "Completed",
    };
  }

  console.log("Final time remaining:", timeRemaining);
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

export const isBookingActiveNow = (
  bookingDate: string,
  startTime: string,
  endTime: string
): boolean => {
  const now = new Date();
  const [year, month, day] = bookingDate.split("-").map(Number);
  const [startHours, startMinutes] = startTime.split(":").map(Number);
  const [endHours, endMinutes] = endTime.split(":").map(Number);

  const startDateTime = new Date(
    year,
    month - 1,
    day,
    startHours,
    startMinutes
  );
  const endDateTime = new Date(year, month - 1, day, endHours, endMinutes);

  return now >= startDateTime && now <= endDateTime;
};

export const isBookingInFuture = (
  bookingDate: string,
  startTime: string
): boolean => {
  const now = new Date();
  const [year, month, day] = bookingDate.split("-").map(Number);
  const [startHours, startMinutes] = startTime.split(":").map(Number);

  const startDateTime = new Date(
    year,
    month - 1,
    day,
    startHours,
    startMinutes
  );

  return now < startDateTime;
};
