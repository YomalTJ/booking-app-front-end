import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface BookingResponse {
  message: string;
  booking: any;
}

export interface ErrorResponse {
  message: string;
  conflictingDates?: {
    startDate: string;
    endDate: string;
  };
}

export const bookingService = {
  createBooking: async (
    token: string,
    roomId: string,
    startDate: string,
    endDate: string
  ): Promise<BookingResponse> => {
    const response = await axios.post(
      `${API_URL}/api/bookings`, // Added /api
      {
        roomId,
        startDate,
        endDate,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  },

  getUserBookings: async (token: string) => {
    const response = await axios.get(`${API_URL}/api/bookings`, {
      // Added /api
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  updateBooking: async (
    token: string,
    bookingId: string,
    startDate: string,
    endDate: string
  ) => {
    const response = await axios.put(
      `${API_URL}/api/bookings/${bookingId}`, // Added /api
      { startDate, endDate },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  },

  deleteBooking: async (token: string, bookingId: string) => {
    const response = await axios.delete(
      `${API_URL}/api/bookings/${bookingId}`,
      {
        // Added /api
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },
};
