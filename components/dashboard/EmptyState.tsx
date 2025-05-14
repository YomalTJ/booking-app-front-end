"use client";

import Link from "next/link";
import React from "react";

const EmptyState: React.FC = () => {
  return (
    <div className="bg-white bg-opacity-10 rounded-lg p-8 text-center">
      <h3 className="text-xl text-white mb-2">No bookings found</h3>
      <p className="text-gray-600">
        You haven't made any bookings yet. Go to the booking page to reserve a
        workspace.
      </p>
      <Link href="/calendar-view">
        <button className="mt-4 px-6 py-2 bg-[#5995fd] text-white rounded-md hover:bg-[#4d84e2] transition cursor-pointer">
          Make a Booking
        </button>
      </Link>
    </div>
  );
};

export default EmptyState;
