"use client";

import React, { useState } from "react";
import FormInput from "./FormInput";
import { authService } from "@/services/auth-service";
import { toast, Toaster } from "react-hot-toast";

const ProfileForm = () => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await authService.updateProfile(userData);
      setUserData({ name: "", email: "" });
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  return (
    <div className="bg-transparent text-white">
      <Toaster position="top-right" />
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Profile information</h2>
        <p className="text-gray-300">Update your name and email address</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6 mb-6">
          <FormInput
            id="name"
            name="name"
            label="Name"
            type="text"
            value={userData.name}
            onChange={handleInputChange}
          />
          <FormInput
            id="email"
            name="email"
            label="Email address"
            type="email"
            value={userData.email}
            onChange={handleInputChange}
          />
        </div>

        <button
          type="submit"
          className="px-6 py-3 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700 cursor-pointer"
        >
          Save
        </button>
      </form>
    </div>
  );
};

export default ProfileForm;
