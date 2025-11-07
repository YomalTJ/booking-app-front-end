// Update the Dashboard component to sort bookings by time
"use client";

import React, { useEffect, useState, useMemo } from "react";
import BookingCard from "@/components/dashboard/BookingCard";
import EmptyState from "@/components/dashboard/EmptyState";
import { bookingService } from "@/services/bookingService";
import { Toaster, toast } from "react-hot-toast";
import { Booking } from "@/types/booking";
import { calculateTimeRemaining, isBookingToday } from "@/utils/timeUtils";

const Dashboard = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState<"date" | "time">("date");

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

  // Sort bookings: active today's bookings first, then by date
  const sortedBookings = useMemo(() => {
    return [...bookings].sort((a, b) => {
      if (sortBy === "time") {
        // Active bookings happening today first
        const aIsActiveToday =
          a.status === "active" && isBookingToday(a.bookingDate);
        const bIsActiveToday =
          b.status === "active" && isBookingToday(b.bookingDate);

        if (aIsActiveToday && !bIsActiveToday) return -1;
        if (!aIsActiveToday && bIsActiveToday) return 1;

        // Then sort by date
        return (
          new Date(a.bookingDate).getTime() - new Date(b.bookingDate).getTime()
        );
      } else {
        // Default sort by date
        return (
          new Date(a.bookingDate).getTime() - new Date(b.bookingDate).getTime()
        );
      }
    });
  }, [bookings, sortBy]);

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
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                  Your Bookings
                </h1>
                <p className="text-gray-600 mt-2">
                  Manage and view all your room bookings
                </p>
              </div>

              {/* Sort Options */}
              {bookings.length > 0 && (
                <div className="flex gap-2">
                  <button
                    onClick={() => setSortBy("date")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      sortBy === "date"
                        ? "bg-orange-500 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    Sort by Date
                  </button>
                  <button
                    onClick={() => setSortBy("time")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      sortBy === "time"
                        ? "bg-orange-500 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    Sort by Time
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Bookings grid */}
          {bookings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedBookings.map((booking) => (
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
