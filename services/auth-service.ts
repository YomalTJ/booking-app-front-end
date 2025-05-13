import axios from "axios";
import { toast } from "react-hot-toast";

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth`;

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
}

export interface UpdateProfileData {
  name: string;
  email: string;
}

export interface ResetPasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const authService = {
  // Login user
  async login(credentials: LoginCredentials) {
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, credentials);

      localStorage.setItem("token", response.data.token);

      toast.success("Login successful!");

      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Login failed";
      toast.error(errorMessage);
      throw error;
    }
  },

  // Register user
  async register(credentials: RegisterCredentials) {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/register`,
        credentials
      );

      localStorage.setItem("token", response.data.token);

      toast.success("Registration successful!");

      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Registration failed";
      toast.error(errorMessage);
      throw error;
    }
  },

  // Logout user
  logout() {
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem("token");
  },

  async updateProfile(data: UpdateProfileData) {
    try {
      const response = await axios.put(`${API_BASE_URL}/profile`, data);
      toast.success("Profile updated successfully!");
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Profile update failed";
      toast.error(errorMessage);
      throw error;
    }
  },

  async resetPassword(data: ResetPasswordData) {
    try {
      const response = await axios.put(`${API_BASE_URL}/reset-password`, data);
      toast.success("Password updated successfully!");
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Password update failed";
      toast.error(errorMessage);
      throw error;
    }
  },
};

// Axios interceptor to add token to requests
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
