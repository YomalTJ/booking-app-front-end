// BookingCard.tsx
"use client";

import React, { useState, useEffect } from "react";
import { bookingService } from "@/services/bookingService";
import { Booking } from "@/types/booking";
import {
  calculateTimeRemaining,
  getBookingDuration,
  isBookingToday,
} from "@/utils/timeUtils";
import toast from "react-hot-toast";

interface BookingCardProps {
  booking: Booking;
  onUpdate: () => void;
}

const BookingCard: React.FC<BookingCardProps> = ({ booking, onUpdate }) => {
  const [isCancelling, setIsCancelling] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(() =>
    calculateTimeRemaining(
      booking.bookingDate,
      booking.startTime,
      booking.endTime,
      booking.isFullDayBooking
    )
  );

  // Update time remaining every minute for active bookings
  useEffect(() => {
    if (booking.status === "active" && isBookingToday(booking.bookingDate)) {
      // Update immediately on mount
      setTimeRemaining(
        calculateTimeRemaining(
          booking.bookingDate,
          booking.startTime,
          booking.endTime,
          booking.isFullDayBooking
        )
      );

      const interval = setInterval(() => {
        const newTimeRemaining = calculateTimeRemaining(
          booking.bookingDate,
          booking.startTime,
          booking.endTime,
          booking.isFullDayBooking
        );
        setTimeRemaining(newTimeRemaining);
      }, 60000); // Update every minute

      return () => clearInterval(interval);
    }
  }, [booking]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (time: string) => {
    try {
      const [hours, minutes] = time.split(":").map(Number);
      const date = new Date();
      date.setHours(hours, minutes, 0);
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return time;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: {
        bg: "bg-green-100",
        text: "text-green-800",
        label: "Active",
        icon: "✓",
      },
      completed: {
        bg: "bg-blue-100",
        text: "text-blue-800",
        label: "Completed",
        icon: "✓",
      },
      cancelled: {
        bg: "bg-red-100",
        text: "text-red-800",
        label: "Cancelled",
        icon: "×",
      },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.active;

    return (
      <div
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full ${config.bg} ${config.text} text-xs font-semibold`}
      >
        <span>{config.icon}</span>
        {config.label}
      </div>
    );
  };

  const handleCancel = async () => {
    if (booking.status !== "active") {
      toast.error("Only active bookings can be cancelled");
      return;
    }

    if (
      !window.confirm(
        "Are you sure you want to cancel this booking? This action cannot be undone."
      )
    ) {
      return;
    }

    setIsCancelling(true);
    try {
      await bookingService.cancelBooking(booking._id);
      toast.success("Booking cancelled successfully");
      onUpdate();
    } catch (error: any) {
      toast.error(error.message || "Failed to cancel booking");
    } finally {
      setIsCancelling(false);
    }
  };

  const isUpcoming =
    new Date(booking.bookingDate) > new Date() && booking.status === "active";
  const isPast =
    new Date(booking.bookingDate) < new Date() &&
    booking.status !== "cancelled";

  // Calculate booking duration
  const bookingDuration = booking.isFullDayBooking
    ? "Full Day"
    : getBookingDuration(booking.startTime, booking.endTime);

  return (
    <div
      className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow ${
        booking.status === "cancelled" ? "opacity-75" : ""
      }`}
    >
      {/* Room Header */}
      <div className="h-32 bg-gradient-to-br from-orange-400 to-orange-600 flex flex-col items-center justify-center text-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-orange-400 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>

        <div className="text-4xl mb-2">🏢</div>
        <p className="font-semibold text-center px-4">{booking.roomId.name}</p>
        <p className="text-xs text-orange-100 mt-1">
          Floor {booking.roomId.floor}
        </p>
      </div>

      {/* Booking Details */}
      <div className="p-4">
        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {booking.roomId.description}
        </p>

        {/* Status and Duration Badge */}
        <div className="flex justify-between items-center mb-4">
          {getStatusBadge(booking.status)}
          <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-semibold">
            ⏱️ {bookingDuration}
          </div>
        </div>

        {/* Time Remaining Display - Only for active bookings happening today */}
        {booking.status === "active" && isBookingToday(booking.bookingDate) && (
          <div
            className={`mb-4 p-3 rounded-lg border ${
              timeRemaining.isActive
                ? "bg-green-50 border-green-200"
                : timeRemaining.isPast
                ? "bg-gray-50 border-gray-200"
                : "bg-blue-50 border-blue-200"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-700">
                {timeRemaining.isActive
                  ? "⏰ Time Remaining"
                  : timeRemaining.isPast
                  ? "✅ Completed"
                  : "⏳ Starting Soon"}
              </span>
              <span
                className={`text-sm font-bold ${
                  timeRemaining.isActive
                    ? "text-green-700"
                    : timeRemaining.isPast
                    ? "text-gray-700"
                    : "text-blue-700"
                }`}
              >
                {timeRemaining.formatted}
              </span>
            </div>

            {/* Progress bar only for active bookings with less than 1 hour remaining */}
            {timeRemaining.isActive &&
              timeRemaining.totalMinutes < 60 &&
              timeRemaining.totalMinutes > 0 && (
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all duration-1000"
                      style={{
                        width: `${Math.max(
                          5,
                          (timeRemaining.totalMinutes / 60) * 100
                        )}%`,
                      }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-600 mt-1 text-right">
                    {timeRemaining.totalMinutes} minutes left
                  </p>
                </div>
              )}
          </div>
        )}

        {/* Date and Time */}
        <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg p-4 mb-4 space-y-2 border border-orange-100">
          <div className="flex items-start gap-3">
            <span className="text-lg">📅</span>
            <div>
              <p className="text-xs text-gray-600 font-medium">Date</p>
              <p className="text-sm font-semibold text-gray-800">
                {formatDate(booking.bookingDate)}
                {isBookingToday(booking.bookingDate) && (
                  <span className="ml-2 bg-orange-500 text-white px-2 py-1 rounded-full text-xs">
                    Today
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-lg">⏰</span>
            <div>
              <p className="text-xs text-gray-600 font-medium">Time</p>
              <p className="text-sm font-semibold text-gray-800">
                {booking.isFullDayBooking
                  ? "Full Day (00:00 - 23:59)"
                  : `${formatTime(booking.startTime)} - ${formatTime(
                      booking.endTime
                    )}`}
              </p>
            </div>
          </div>
        </div>

        {/* Room Details */}
        <div className="flex gap-4 mb-4 text-sm">
          <div className="flex items-center gap-2 text-gray-700">
            <span>👥</span>
            <span>Capacity: {booking.roomId.capacity}</span>
          </div>
        </div>

        {/* Notes */}
        {booking.notes && (
          <div className="mb-4 p-3 bg-blue-50 rounded border border-blue-200">
            <p className="text-xs font-semibold text-gray-700 mb-1">Notes:</p>
            <p className="text-sm text-gray-600">{booking.notes}</p>
          </div>
        )}

        {/* Booking Dates */}
        <div className="text-xs text-gray-500 mb-4 space-y-1">
          <p>
            Booked on:{" "}
            {new Date(booking.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>

        {/* Action Button */}
        {booking.status === "active" && (
          <button
            onClick={handleCancel}
            disabled={isCancelling}
            className="w-full py-2 px-4 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
          >
            {isCancelling ? (
              <span className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
                Cancelling...
              </span>
            ) : (
              "Cancel Booking"
            )}
          </button>
        )}

        {booking.status === "cancelled" && (
          <div className="w-full py-2 px-4 bg-gray-200 text-gray-600 text-center rounded-lg font-semibold">
            Booking Cancelled
          </div>
        )}

        {booking.status === "completed" && (
          <div className="w-full py-2 px-4 bg-blue-100 text-blue-700 text-center rounded-lg font-semibold">
            Booking Completed
          </div>
        )}

        {/* Booking Timeline Indicator */}
        {/* {booking.status === "active" && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            {timeRemaining.isActive ? (
              <p className="text-xs text-green-600 font-medium text-center">
                🎯 Active Now - {timeRemaining.hours}h {timeRemaining.minutes}m
                remaining
              </p>
            ) : timeRemaining.isPast ? (
              <p className="text-xs text-gray-600 font-medium text-center">
                ✅ Completed
              </p>
            ) : (
              <p className="text-xs text-orange-600 font-medium text-center">
                ⏳ Upcoming - Starts in {timeRemaining.hours}h{" "}
                {timeRemaining.minutes}m
              </p>
            )}
          </div>
        )} */}
      </div>
    </div>
  );
};

export default BookingCard;
