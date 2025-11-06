"use client";

import Link from "next/link";
import React, { useState } from "react";

const BookingDetailsForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    companyName: "",
    telephone: "",
    email: "",
    address: "",
    price: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 text-white">
      {[
        { label: "Full Name", name: "fullName" },
        { label: "Company Name", name: "companyName" },
        { label: "Telephone", name: "telephone" },
        { label: "Email", name: "email" },
        { label: "Address", name: "address" },
        { label: "Enter Price (LKR)", name: "price" },
      ].map((field) => (
        <div key={field.name}>
          <label className="block mb-1 text-lg">{field.label}</label>
          <input
            type={field.name === "email" ? "email" : "text"}
            name={field.name}
            value={(formData as any)[field.name]}
            onChange={handleChange}
            className="w-full p-3 bg-gray-600 text-white border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5995fd]"
            required
          />
        </div>
      ))}

      <Link href="/dashboard">
        <button
          type="submit"
          className="w-full p-4 bg-green-600 text-white text-lg font-medium rounded-md hover:bg-green-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Book Now
        </button>
      </Link>
    </form>
  );
};

export default BookingDetailsForm;
