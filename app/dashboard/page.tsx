"use client";

import React, { useEffect, useState } from "react";
import BookingCard from "@/components/dashboard/BookingCard";
import EmptyState from "@/components/dashboard/EmptyState";
import { bookingService } from "@/services/bookingService";
import { Toaster, toast } from "react-hot-toast";
import { Booking } from "@/types/booking";

const Dashboard = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please log in to view your bookings");
        return;
      }

      const userBookings = await bookingService.getUserBookings(token);
      setBookings(userBookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error("Failed to load bookings. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-50 p-4 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" />
      <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Dashboard header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
              Your Bookings
            </h1>
            <p className="text-gray-600 mt-2">
              Manage and view all your room bookings
            </p>
          </div>

          {/* Bookings grid */}
          {bookings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookings.map((booking) => (
                <BookingCard
                  key={booking._id}
                  booking={booking}
                  onUpdate={fetchBookings}
                />
              ))}
            </div>
          ) : (
            /* Empty state - shown when no bookings exist */
            <EmptyState />
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;