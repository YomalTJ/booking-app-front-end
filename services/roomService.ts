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

  isRoomAvailableOnDate(room: Room, dateString: string): boolean {
    const checkDateStr = dateString.split("T")[0];
    const checkDate = new Date(checkDateStr + "T00:00:00.000Z");

    if (room.bookings && room.bookings.length > 0) {
      for (const booking of room.bookings) {
        const startDateStr = booking.startDate.split("T")[0];
        const endDateStr = booking.endDate.split("T")[0];

        const startDate = new Date(startDateStr + "T00:00:00.000Z");
        const endDate = new Date(endDateStr + "T00:00:00.000Z");

        if (
          checkDate.getTime() >= startDate.getTime() &&
          checkDate.getTime() <= endDate.getTime()
        ) {
          return false;
        }
      }

      return true;
    }

    return room.availability;
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
};
