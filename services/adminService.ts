import { toast } from "react-hot-toast";

const API_BASE_URL = "/api/admin";

export interface AdminLoginCredentials {
  username: string;
  password: string;
}

export interface AdminStats {
  totalUsers: number;
  totalRooms: number;
  totalBookings: number;
  activeBookings: number;
  availableRooms: number;
  completedBookings: number;
}

export interface Booking {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    companyName: string;
  };
  roomId: {
    _id: string;
    name: string;
    floor: number;
  };
  bookingDate: string;
  startTime: string;
  endTime: string;
  isFullDayBooking: boolean;
  status: string;
  notes: string;
  createdAt: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  companyName: string;
  phoneNumber: string;
  createdAt: string;
}

export interface Room {
  _id: string;
  name: string;
  description: string;
  capacity: number;
  floor: number;
  availability: boolean;
  image: string;
  createdAt: string;
}

export interface Company {
  companyName: string;
  userCount: number;
}

export interface CompanyHours {
  _id: string;
  companyName: string;
  totalHours: number;
  usedHours: number;
  remainingHours: number;
  isActive: boolean;
  transactions: Array<{
    type: "add" | "use" | "refund";
    hours: number;
    description?: string;
    bookingId?: string;
    createdAt: string;
  }>;
  createdAt: string;
}

export const adminService = {
  async login(credentials: AdminLoginCredentials) {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Login failed");
      }

      const data = await response.json();

      if (typeof window !== "undefined") {
        localStorage.setItem("adminToken", data.token);
        localStorage.setItem(
          "admin",
          JSON.stringify({
            name: data.name,
            username: data.username,
          })
        );
      }

      toast.success("Admin login successful!");
      return data;
    } catch (error: any) {
      toast.error(error.message || "Login failed");
      throw error;
    }
  },

  async getStats(): Promise<AdminStats> {
    try {
      const token = this.getToken();
      if (!token) throw new Error("No admin token found");

      const response = await fetch(`${API_BASE_URL}/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch stats");
      }

      const data = await response.json();
      return data.stats;
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch statistics");
      throw error;
    }
  },

  async getAllBookings(): Promise<Booking[]> {
    try {
      const token = this.getToken();
      if (!token) throw new Error("No admin token found");

      const response = await fetch(`${API_BASE_URL}/bookings`, {
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
      toast.error(error.message || "Failed to fetch bookings");
      throw error;
    }
  },

  async getAllUsers(): Promise<User[]> {
    try {
      const token = this.getToken();
      if (!token) throw new Error("No admin token found");

      const response = await fetch(`${API_BASE_URL}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch users");
      }

      const data = await response.json();
      return data.users;
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch users");
      throw error;
    }
  },

  async getAllRooms(): Promise<Room[]> {
    try {
      const token = this.getToken();
      if (!token) throw new Error("No admin token found");

      const response = await fetch(`${API_BASE_URL}/rooms`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch rooms");
      }

      const data = await response.json();
      return data.rooms;
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch rooms");
      throw error;
    }
  },

  async getCompanies(): Promise<Company[]> {
    try {
      const token = this.getToken();
      if (!token) throw new Error("No admin token found");

      const response = await fetch(`${API_BASE_URL}/companies`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch companies");
      }

      const data = await response.json();
      return data.companies;
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch companies");
      throw error;
    }
  },

  async getCompanyHours(): Promise<CompanyHours[]> {
    try {
      const token = this.getToken();
      if (!token) throw new Error("No admin token found");

      const response = await fetch(`${API_BASE_URL}/company-hours`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch company hours");
      }

      const data = await response.json();
      return data.companyHours;
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch company hours");
      throw error;
    }
  },

  async addCompanyHours(
    companyName: string,
    hours: number,
    description?: string
  ): Promise<CompanyHours> {
    try {
      const token = this.getToken();
      if (!token) throw new Error("No admin token found");

      const response = await fetch(`${API_BASE_URL}/company-hours`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ companyName, hours, description }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to add hours");
      }

      const data = await response.json();
      toast.success("Hours added successfully!");
      return data.companyHours;
    } catch (error: any) {
      toast.error(error.message || "Failed to add hours");
      throw error;
    }
  },

  logout() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("admin");
    }
    toast.success("Logged out successfully");
  },

  isAuthenticated(): boolean {
    if (typeof window !== "undefined") {
      return !!localStorage.getItem("adminToken");
    }
    return false;
  },

  getToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("adminToken");
    }
    return null;
  },
};
