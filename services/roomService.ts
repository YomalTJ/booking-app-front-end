import axios from "axios";

export interface Room {
  _id: string;
  name: string;
  description: string;
  capacity: number;
  image: string;
  availability: boolean;
  bookings?: {
    startDate: string;
    endDate: string;
  }[];
}

export interface RoomResponse {
  success: boolean;
  count: number;
  data: Room[];
}

export interface AvailabilityResponse {
  isAvailable: boolean;
  conflictingDates?: {
    startDate: string;
    endDate: string;
  }[];
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const roomService = {
  // Get all rooms - FIXED URL
  async getAllRooms(): Promise<Room[]> {
    try {
      const response = await axios.get<RoomResponse>(`${API_BASE_URL}/api/rooms`);
      console.log("Rooms API Response:", response.data);
      return response.data.data;
    } catch (error: any) {
      console.error("Error fetching rooms:", error.response?.data || error.message);
      console.error("Full API URL attempted:", `${API_BASE_URL}/api/rooms`);
      return [];
    }
  },

  getRoomAvailabilityForDateRange(
    room: Room,
    startDateStr: string,
    endDateStr: string
  ): AvailabilityResponse {
    // First check if room is generally available
    if (!room.availability) {
      return { isAvailable: false };
    }

    // If no booking data, room is available
    if (!room.bookings || room.bookings.length === 0) {
      return { isAvailable: true };
    }

    // Convert input dates to Date objects for comparison
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);

    const conflictingDates: { startDate: string; endDate: string }[] = [];

    // Check if requested date range overlaps with any existing booking
    for (const booking of room.bookings) {
      const bookedStartDate = new Date(booking.startDate);
      const bookedEndDate = new Date(booking.endDate);

      // Reset time part to compare only dates
      bookedStartDate.setHours(0, 0, 0, 0);
      bookedEndDate.setHours(0, 0, 0, 0);
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);

      // Check for overlap
      const hasOverlap = 
        (startDate <= bookedEndDate && endDate >= bookedStartDate);

      if (hasOverlap) {
        conflictingDates.push({
          startDate: booking.startDate,
          endDate: booking.endDate,
        });
      }
    }

    return {
      isAvailable: conflictingDates.length === 0,
      conflictingDates: conflictingDates.length > 0 ? conflictingDates : undefined,
    };
  },

  isRoomAvailableForDateRange(
    room: Room,
    startDateStr: string,
    endDateStr: string
  ): boolean {
    const availabilityResult = this.getRoomAvailabilityForDateRange(
      room,
      startDateStr,
      endDateStr
    );
    return availabilityResult.isAvailable;
  },

  isRoomAvailableOnDate(room: Room, dateString: string): boolean {
    // For single date checking, we use the same start and end date
    return this.isRoomAvailableForDateRange(room, dateString, dateString);
  },

  async getAvailableRoomsForDate(dateString: string): Promise<Room[]> {
    try {
      const allRooms = await this.getAllRooms();
      return allRooms.filter((room) => {
        return room.availability && this.isRoomAvailableOnDate(room, dateString);
      });
    } catch (error) {
      console.error("Error getting available rooms:", error);
      return [];
    }
  },

  async getAvailabilityCountForMonth(
    month: number,
    year: number
  ): Promise<Record<string, { available: number }>> {
    try {
      const allRooms = await this.getAllRooms();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const availabilityData: Record<string, { available: number }> = {};

      for (let day = 1; day <= daysInMonth; day++) {
        const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        
        let availableCount = 0;
        for (const room of allRooms) {
          if (room.availability && this.isRoomAvailableOnDate(room, dateString)) {
            availableCount++;
          }
        }

        availabilityData[day] = { available: availableCount };
      }

      return availabilityData;
    } catch (error) {
      console.error("Error getting availability count:", error);
      return {};
    }
  },

  // Enhanced method to check availability with detailed conflict information
  async checkAvailabilityForDateRange(
    roomId: string,
    startDate: string,
    endDate: string
  ): Promise<AvailabilityResponse> {
    try {
      const allRooms = await this.getAllRooms();
      const room = allRooms.find((r) => r._id === roomId);

      if (!room) {
        return { isAvailable: false };
      }

      return this.getRoomAvailabilityForDateRange(room, startDate, endDate);
    } catch (error) {
      console.error("Error checking room availability:", error);
      return { isAvailable: false };
    }
  },
};