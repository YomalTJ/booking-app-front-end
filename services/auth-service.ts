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
            name: data.name, // ✅ Fixed: access data.name directly
            companyName: data.companyName, // ✅ Fixed: access data.companyName directly
            email: data.email, // ✅ Fixed: access data.email directly
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

      // Show success message that includes email confirmation
      toast.success(
        data.message || "Registration successful! Welcome email sent."
      );
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

  async requestPasswordReset(email: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to send verification code");
      }

      const data = await response.json();
      toast.success("Verification code sent to your email");
      return data;
    } catch (error: any) {
      toast.error(error.message || "Failed to send verification code");
      throw error;
    }
  },

  async verifyOtp(email: string, otp: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Invalid verification code");
      }

      const data = await response.json();
      toast.success("Email verified successfully");
      return data;
    } catch (error: any) {
      toast.error(error.message || "Invalid verification code");
      throw error;
    }
  },

  async resetPasswordWithOtp(email: string, otp: string, newPassword: string) {
    try {
      console.log("Making reset request with:", {
        email,
        otp: otp ? "***" : "missing",
        newPassword: newPassword ? "***" : "missing",
      });

      const response = await fetch(`${API_BASE_URL}/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp, newPassword }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.log("Reset password error response:", error);
        throw new Error(error.message || "Failed to reset password");
      }

      const data = await response.json();
      toast.success(
        "Password reset successfully! You can now log in with your new password."
      );
      return data;
    } catch (error: any) {
      toast.error(error.message || "Failed to reset password");
      throw error;
    }
  },
};
