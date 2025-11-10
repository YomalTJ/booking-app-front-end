"use client";

import React, { useEffect, useState, useMemo } from "react";
import BookingCard from "@/components/dashboard/BookingCard";
import EmptyState from "@/components/dashboard/EmptyState";
import { bookingService } from "@/services/bookingService";
import { Toaster, toast } from "react-hot-toast";
import { Booking } from "@/types/booking";

const Dashboard = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState<"date" | "time">("date");

  // Date filter states
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [filterStatus, setFilterStatus] = useState<
    "all" | "active" | "cancelled" | "completed"
  >("all");

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

  // Filter bookings by date and status
  const filteredBookings = useMemo(() => {
    let filtered = [...bookings];

    // Filter by date
    if (selectedDate) {
      filtered = filtered.filter((booking) => {
        const bookingDate = new Date(booking.bookingDate)
          .toISOString()
          .split("T")[0];
        return bookingDate === selectedDate;
      });
    }

    // Filter by status
    if (filterStatus !== "all") {
      filtered = filtered.filter((booking) => booking.status === filterStatus);
    }

    return filtered;
  }, [bookings, selectedDate, filterStatus]);

  // Sort bookings
  const sortedBookings = useMemo(() => {
    return [...filteredBookings].sort((a, b) => {
      if (sortBy === "time") {
        // Sort by date and then by start time
        const dateCompare =
          new Date(a.bookingDate).getTime() - new Date(b.bookingDate).getTime();
        if (dateCompare !== 0) return dateCompare;

        // If same date, sort by start time
        return a.startTime.localeCompare(b.startTime);
      } else {
        // Default sort by date (newest first)
        return (
          new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime()
        );
      }
    });
  }, [filteredBookings, sortBy]);

  useEffect(() => {
    fetchBookings();
  }, []);

  // Clear all filters
  const clearFilters = () => {
    setSelectedDate("");
    setFilterStatus("all");
  };

  // Check if any filters are active
  const hasActiveFilters = selectedDate || filterStatus !== "all";

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
            <div className="flex justify-between items-center mb-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                  Your Bookings
                </h1>
                <p className="text-gray-600 mt-2">
                  Manage and view all your room bookings
                </p>
              </div>
            </div>

            {/* Filter and Sort Controls */}
            {bookings.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-4">
                <div className="flex flex-wrap gap-4 items-end">
                  {/* Date Filter */}
                  <div className="flex-1 min-w-[200px]">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Filter by Date
                    </label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>

                  {/* Status Filter */}
                  <div className="flex-1 min-w-[200px]">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Filter by Status
                    </label>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value as any)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="all">All Bookings</option>
                      <option value="active">Active</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  {/* Sort Options */}
                  <div className="flex-1 min-w-[200px]">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sort By
                    </label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSortBy("date")}
                        className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          sortBy === "date"
                            ? "bg-orange-500 text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                      >
                        Date
                      </button>
                      <button
                        onClick={() => setSortBy("time")}
                        className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          sortBy === "time"
                            ? "bg-orange-500 text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                      >
                        Time
                      </button>
                    </div>
                  </div>

                  {/* Clear Filters */}
                  {hasActiveFilters && (
                    <div className="flex items-end">
                      <button
                        onClick={clearFilters}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
                      >
                        Clear Filters
                      </button>
                    </div>
                  )}
                </div>

                {/* Active Filters Display */}
                {hasActiveFilters && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="text-sm text-gray-600">
                      Active Filters:
                    </span>
                    {selectedDate && (
                      <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
                        Date: {new Date(selectedDate).toLocaleDateString()}
                      </span>
                    )}
                    {filterStatus !== "all" && (
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm capitalize">
                        Status: {filterStatus}
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Results Count */}
          {bookings.length > 0 && (
            <div className="mb-4 text-gray-600">
              Showing {sortedBookings.length} of {bookings.length} bookings
            </div>
          )}

          {/* Bookings grid */}
          {sortedBookings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedBookings.map((booking) => (
                <BookingCard
                  key={booking._id}
                  booking={booking}
                  onUpdate={fetchBookings}
                />
              ))}
            </div>
          ) : bookings.length > 0 ? (
            /* No results after filtering */
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No bookings match your filters
              </h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your filters to see more results
              </p>
              <button
                onClick={clearFilters}
                className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                Clear All Filters
              </button>
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
