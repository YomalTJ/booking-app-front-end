"use client";

import React, { useState, useEffect } from "react";
import { FaSave } from "react-icons/fa";
import FormInput from "./FormInput";
import { authService } from "@/services/auth-service";
import { toast, Toaster } from "react-hot-toast";

const ProfileForm = () => {
  const [userData, setUserData] = useState({
    name: "",
    companyName: "",
    email: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  // Load user data from localStorage on component mount
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      setUserData({
        name: user.name || "",
        companyName: user.companyName || "",
        email: user.email || "",
      });
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userData.name || !userData.companyName || !userData.email) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      const result = await authService.updateProfile(userData);

      // Update localStorage with new user data
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        const updatedUser = { ...user, ...userData };
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Toaster position="top-right" />
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Profile Information
        </h2>
        <p className="text-gray-600">
          Update your name, company, and email address
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6 mb-6">
          <FormInput
            id="name"
            name="name"
            label="Full Name"
            type="text"
            value={userData.name}
            onChange={handleInputChange}
            disabled={isLoading}
          />
          <FormInput
            id="companyName"
            name="companyName"
            label="Company Name"
            type="text"
            value={userData.companyName}
            onChange={handleInputChange}
            disabled={isLoading}
          />
          <FormInput
            id="email"
            name="email"
            label="Email Address"
            type="email"
            value={userData.email}
            onChange={handleInputChange}
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-600 cursor-pointer"
        >
          <FaSave />
          {isLoading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default ProfileForm;
