export interface Room {
  _id: string;
  name: string;
  description: string;
  capacity: number;
  floor: number;
  image?: string;
  availability: boolean;
}

export interface Booking {
  _id: string;
  userId: string;
  roomId: Room;
  bookingDate: string;
  startTime: string;
  endTime: string;
  isFullDayBooking: boolean;
  status: "active" | "cancelled" | "completed";
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BookingPayload {
  roomId: string;
  bookingDate: string;
  startTime?: string;
  endTime?: string;
  isFullDayBooking?: boolean;
  notes?: string;
}

export interface AvailabilityResult {
  isAvailable: boolean;
  type: "available" | "fully_booked" | "partially_booked" | "unavailable";
  bookedRanges?: TimeRange[];
  message: string;
}

export interface TimeRange {
  startTime: string;
  endTime: string;
}
