"use client";

import React, { useState } from "react";
import { FaSave } from "react-icons/fa";
import PasswordInput from "./PasswordInput";
import { authService } from "@/services/auth-service";
import { toast, Toaster } from "react-hot-toast";

const PasswordForm = () => {
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match!");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    try {
      await authService.resetPassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword,
      });

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Failed to reset password:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Toaster position="top-right" />
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Update Password
        </h2>
        <p className="text-gray-600">
          Ensure your account is using a long, random password to stay secure
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <PasswordInput
          id="currentPassword"
          name="currentPassword"
          label="Current Password"
          value={passwordData.currentPassword}
          onChange={handleInputChange}
          disabled={isLoading}
        />

        <PasswordInput
          id="newPassword"
          name="newPassword"
          label="New Password"
          value={passwordData.newPassword}
          onChange={handleInputChange}
          disabled={isLoading}
        />

        <PasswordInput
          id="confirmPassword"
          name="confirmPassword"
          label="Confirm New Password"
          value={passwordData.confirmPassword}
          onChange={handleInputChange}
          disabled={isLoading}
        />

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Password Requirements:</strong> Must contain at least one
            uppercase letter, one lowercase letter, one number, and one special
            character (@$!%*?&)
          </p>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-600 cursor-pointer"
        >
          <FaSave />
          {isLoading ? "Updating..." : "Update Password"}
        </button>
      </form>
    </div>
  );
};

export default PasswordForm;
