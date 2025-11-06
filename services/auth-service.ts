import { toast } from "react-hot-toast";

const API_BASE_URL = "/api/auth";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  companyName: string;
  email: string;
  password: string;
  phoneNumber: string;
}

export interface UpdateProfileData {
  name: string;
  companyName: string;
  email: string;
}

export interface ResetPasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const authService = {
  async login(credentials: LoginCredentials) {
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
        localStorage.setItem("token", data.token);
        localStorage.setItem(
          "user",
          JSON.stringify({
            name: data.name,
            companyName: data.companyName,
            email: data.email,
          })
        );
      }

      toast.success("Login successful!");
      return data;
    } catch (error: any) {
      toast.error(error.message || "Login failed");
      throw error;
    }
  },

  async register(credentials: RegisterCredentials) {
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Registration failed");
      }

      const data = await response.json();

      if (typeof window !== "undefined") {
        localStorage.setItem("token", data.token);
        localStorage.setItem(
          "user",
          JSON.stringify({
            name: data.user.name,
            companyName: data.user.companyName,
            email: data.user.email,
          })
        );
      }

      toast.success("Registration successful!");
      return data;
    } catch (error: any) {
      toast.error(error.message || "Registration failed");
      throw error;
    }
  },

  async updateProfile(data: UpdateProfileData) {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(`${API_BASE_URL}/profile/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update profile");
      }

      const result = await response.json();
      toast.success(result.message || "Profile updated successfully!");
      return result;
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
      throw error;
    }
  },

  async resetPassword(data: ResetPasswordData) {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(`${API_BASE_URL}/password/reset`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to reset password");
      }

      const result = await response.json();
      toast.success(result.message || "Password updated successfully!");
      return result;
    } catch (error: any) {
      toast.error(error.message || "Failed to reset password");
      throw error;
    }
  },

  async deleteAccount() {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(`${API_BASE_URL}/account/delete`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete account");
      }

      const result = await response.json();

      // Clear localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }

      toast.success(result.message || "Account deleted successfully");
      return result;
    } catch (error: any) {
      toast.error(error.message || "Failed to delete account");
      throw error;
    }
  },

  logout() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    toast.success("Logged out successfully");
  },

  isAuthenticated(): boolean {
    if (typeof window !== "undefined") {
      return !!localStorage.getItem("token");
    }
    return false;
  },

  getToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token");
    }
    return null;
  },
};
