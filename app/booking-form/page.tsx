"use client";

import React from "react";
import BookingFormComponent from "@/components/booking/BookingFormComponent";

const BookingFormPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-700 to-gray-900 p-4 flex flex-col items-center">
      <div className="w-full max-w-md mt-10">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-8">
          Check Availability on Workspace
        </h1>

        <BookingFormComponent />
      </div>
    </div>
  );
};

export default BookingFormPage;
