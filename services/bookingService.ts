const API_BASE_URL = "/api/bookings";

export interface BookingPayload {
  roomId: string;
  bookingDate: string;
  startTime?: string;
  endTime?: string;
  isFullDayBooking?: boolean;
  notes?: string;
}

export const bookingService = {
  async checkAvailability(
    roomId: string,
    bookingDate: string,
    startTime?: string,
    endTime?: string
  ) {
    try {
      // Ensure date is in YYYY-MM-DD format
      const dateStr = this.formatDateForAPI(bookingDate);

      const response = await fetch(`${API_BASE_URL}/check-availability`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roomId,
          bookingDate: dateStr,
          startTime,
          endTime,
          checkType: startTime && endTime ? "timeSlot" : "day",
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to check availability");
      }

      return await response.json();
    } catch (error: any) {
      console.error("Availability check error:", error);
      throw error;
    }
  },

  async createBooking(payload: BookingPayload) {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("No authentication token found");
      }

      // Ensure date is in YYYY-MM-DD format
      const dateStr = this.formatDateForAPI(payload.bookingDate);

      const response = await fetch(`${API_BASE_URL}/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...payload,
          bookingDate: dateStr,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create booking");
      }

      return await response.json();
    } catch (error: any) {
      console.error("Booking creation error:", error);
      throw error;
    }
  },

  async getUserBookings(token: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/user-bookings`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch bookings");
      }

      const data = await response.json();
      return data.bookings;
    } catch (error: any) {
      console.error("Fetch bookings error:", error);
      throw error;
    }
  },

  async cancelBooking(bookingId: string) {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(`${API_BASE_URL}/cancel`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ bookingId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to cancel booking");
      }

      return await response.json();
    } catch (error: any) {
      console.error("Cancel booking error:", error);
      throw error;
    }
  },

  // Helper function to format date for API (YYYY-MM-DD)
  formatDateForAPI(dateInput: string | Date | number): string {
    let date: Date;

    if (typeof dateInput === "string") {
      // If already in YYYY-MM-DD format, return as is
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateInput)) {
        return dateInput;
      }
      date = new Date(dateInput);
    } else if (typeof dateInput === "number") {
      // If it's a day number (1-31), construct date with current month/year
      const today = new Date();
      date = new Date(today.getFullYear(), today.getMonth(), dateInput);
    } else {
      date = dateInput;
    }

    // Format as YYYY-MM-DD without timezone conversion
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  },
};
