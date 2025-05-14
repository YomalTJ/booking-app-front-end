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

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const roomService = {
  // Get all rooms
  async getAllRooms(): Promise<Room[]> {
    try {
      const response = await axios.get<RoomResponse>(`${API_BASE_URL}/rooms/`);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching rooms:", error);
      return [];
    }
  },

  isRoomAvailableForDateRange(
    room: Room,
    startDateStr: string,
    endDateStr: string
  ): boolean {
    // If no booking data or empty bookings, just check the general availability flag
    if (!room.bookings || room.bookings.length === 0) {
      return room.availability;
    }

    // Convert input dates to Date objects for comparison
    const startDate = new Date(startDateStr + "T00:00:00.000Z");
    const endDate = new Date(endDateStr + "T00:00:00.000Z");

    // Check if requested date range overlaps with any existing booking
    for (const booking of room.bookings) {
      const bookedStartDate = new Date(booking.startDate);
      const bookedEndDate = new Date(booking.endDate);

      // Check for overlap - if any day in the requested range overlaps with a booked range
      if (
        // Case 1: Start date falls within an existing booking
        (startDate >= bookedStartDate && startDate <= bookedEndDate) ||
        // Case 2: End date falls within an existing booking
        (endDate >= bookedStartDate && endDate <= bookedEndDate) ||
        // Case 3: Booking falls completely within the requested date range
        (startDate <= bookedStartDate && endDate >= bookedEndDate)
      ) {
        return false;
      }
    }

    return true;
  },

  isRoomAvailableOnDate(room: Room, dateString: string): boolean {
    // For single date checking, we use the same start and end date
    return this.isRoomAvailableForDateRange(room, dateString, dateString);
  },

  async getAvailableRoomsForDate(dateString: string): Promise<Room[]> {
    try {
      const allRooms = await this.getAllRooms();
      const datePart = dateString.split("T")[0];
      return allRooms.filter((room) => {
        return this.isRoomAvailableOnDate(room, datePart);
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
        const dateString = `${year}-${String(month + 1).padStart(
          2,
          "0"
        )}-${String(day).padStart(2, "0")}`;

        let availableCount = 0;
        for (const room of allRooms) {
          if (this.isRoomAvailableOnDate(room, dateString)) {
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

  // New method to check availability for a specific date range
  async checkAvailabilityForDateRange(
    roomId: string,
    startDate: string,
    endDate: string
  ): Promise<boolean> {
    try {
      const allRooms = await this.getAllRooms();
      const room = allRooms.find((r) => r._id === roomId);

      if (!room) {
        return false;
      }

      return this.isRoomAvailableForDateRange(room, startDate, endDate);
    } catch (error) {
      console.error("Error checking room availability:", error);
      return false;
    }
  },
};
