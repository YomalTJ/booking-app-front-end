"use client";

import React, { useState } from "react";
import PackageSelector from "./PackageSelector";
import DateRangeSelector from "./DateRangeSelector";
import BookingDetailsForm from "./BookingDetailsForm";

const BookingFormComponent = () => {
  const [selectedPackage, setSelectedPackage] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showBookingDetailsForm, setShowBookingDetailsForm] = useState(false);

  const handleCheckAvailability = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedPackage && startDate && endDate) {
      setShowBookingDetailsForm(true);
    }
  };

  return (
    <>
      <form onSubmit={handleCheckAvailability} className="space-y-6">
        <PackageSelector
          selectedPackage={selectedPackage}
          setSelectedPackage={setSelectedPackage}
        />
        <DateRangeSelector
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
        />
        <button
          type="submit"
          className="w-full p-4 bg-[#5995fd] text-white text-lg font-medium rounded-md hover:bg-[#4d84e2] transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4d84e2]"
        >
          Check Availability
        </button>
      </form>

      {showBookingDetailsForm && (
        <div className="mt-10">
          <BookingDetailsForm />
        </div>
      )}
    </>
  );
};

export default BookingFormComponent;
