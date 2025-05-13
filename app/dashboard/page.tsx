"use client";

import React, { useEffect, useState } from "react";
import BookingCard from "@/components/dashboard/BookingCard";
import EmptyState from "@/components/dashboard/EmptyState";
import { bookingService } from "@/services/bookingService";
import { Toaster, toast } from "react-hot-toast";

interface Booking {
  _id: string;
  userId: string;
  roomId: {
    _id: string;
    name: string;
    description: string;
    capacity: number;
    image: string;
    availability: boolean;
  };
  startDate: string;
  endDate: string;
  __v: number;
}

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
      <div className="min-h-screen bg-gradient-to-b from-gray-700 to-gray-900 p-4 md:p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" />
      <div className="min-h-screen bg-gradient-to-b from-gray-700 to-gray-900 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Dashboard header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Your Bookings
            </h1>
          </div>

          {/* Bookings grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map((booking) => (
              <BookingCard
                key={booking._id}
                booking={booking}
                onUpdate={fetchBookings}
              />
            ))}
          </div>

          {/* Empty state - shown when no bookings exist */}
          {bookings.length === 0 && !isLoading && <EmptyState />}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
