"use client";

import React from "react";
import Link from "next/link";

const EmptyState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="text-center">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-100 rounded-full mb-4">
          <svg
            className="w-10 h-10 text-orange-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>

        {/* Message */}
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
          No Bookings Yet
        </h2>
        <p className="text-gray-600 mb-8 max-w-sm">
          You haven't made any room bookings yet. Start by selecting a room and
          choosing your preferred date and time.
        </p>

        {/* CTA Button */}
        <Link href="/">
          <button className="inline-flex items-center gap-2 px-8 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-colors shadow-md hover:shadow-lg">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Book a Room
          </button>
        </Link>

        {/* Additional Info */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl">
          <div className="p-4 bg-white rounded-lg border border-gray-200">
            <div className="text-2xl mb-2">📅</div>
            <h3 className="font-semibold text-gray-800 mb-1">Easy Scheduling</h3>
            <p className="text-sm text-gray-600">
              Choose from available dates and time slots
            </p>
          </div>

          <div className="p-4 bg-white rounded-lg border border-gray-200">
            <div className="text-2xl mb-2">🏢</div>
            <h3 className="font-semibold text-gray-800 mb-1">Multiple Rooms</h3>
            <p className="text-sm text-gray-600">
              Select from various office and meeting spaces
            </p>
          </div>

          <div className="p-4 bg-white rounded-lg border border-gray-200">
            <div className="text-2xl mb-2">⚡</div>
            <h3 className="font-semibold text-gray-800 mb-1">Instant Booking</h3>
            <p className="text-sm text-gray-600">
              Get instant confirmation of your booking
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmptyState;