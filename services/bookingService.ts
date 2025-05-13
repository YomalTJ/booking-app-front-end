import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const bookingService = {
  createBooking: async (
    token: string,
    roomId: string,
    startDate: string,
    endDate: string
  ) => {
    const response = await axios.post(
      `${API_URL}/bookings`,
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
    const response = await axios.get(`${API_URL}/bookings`, {
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
      `${API_URL}/bookings/${bookingId}`,
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
    const response = await axios.delete(`${API_URL}/bookings/${bookingId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
};
