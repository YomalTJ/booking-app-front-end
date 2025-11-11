import React, { useState } from "react";
import { Booking } from "@/types/booking";

interface BookingCardProps {
  booking: Booking; // This now correctly uses the Booking type from types/booking.ts
  onUpdate: () => void;
}

const BookingCard: React.FC<BookingCardProps> = ({ booking, onUpdate }) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  // Format date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format time display
  const formatTimeDisplay = () => {
    if (booking.isFullDayBooking) {
      return `Full Day (${booking.startTime} - ${booking.endTime})`;
    }
    return `${booking.startTime} - ${booking.endTime}`;
  };

  // Check if booking can be cancelled (within 24 hours)
  const canCancel = () => {
    if (booking.status !== "active") return false;

    const bookingDate = new Date(booking.bookingDate);
    const now = new Date();

    // Calculate hours until booking starts
    const hoursUntilBooking =
      (bookingDate.getTime() - now.getTime()) / (1000 * 60 * 60);

    // Calculate hours since booking was created
    const bookingCreatedAt = new Date(booking.createdAt);
    const hoursSinceCreation =
      (now.getTime() - bookingCreatedAt.getTime()) / (1000 * 60 * 60);

    // Allow cancellation if:
    // 1. Booking is more than 24 hours away OR
    // 2. Booking was created within the last 1 hour (grace period)
    return hoursUntilBooking > 24 || hoursSinceCreation <= 1;
  };

  const getCancellationMessage = () => {
    const bookingDate = new Date(booking.bookingDate);
    const now = new Date();
    const hoursUntilBooking =
      (bookingDate.getTime() - now.getTime()) / (1000 * 60 * 60);

    const bookingCreatedAt = new Date(booking.createdAt);
    const hoursSinceCreation =
      (now.getTime() - bookingCreatedAt.getTime()) / (1000 * 60 * 60);

    if (hoursUntilBooking > 24) {
      return "⏳ Can be cancelled anytime until 24 hours after booking";
    } else if (hoursSinceCreation <= 1) {
      return "⏳ Can be cancelled within 1 hour of creation";
    } else {
      return "⚠️ Cannot cancel (within 24 hours of booking time)";
    }
  };

  const handleCancelClick = () => {
    setShowConfirmation(true);
  };

  const handleConfirmCancel = async () => {
    setIsCancelling(true);
    try {
      const { bookingService } = await import("@/services/bookingService");
      await bookingService.cancelBooking(booking._id);
      onUpdate(); // Refresh the bookings list
    } catch (error) {
      console.error("Cancel booking error:", error);
    } finally {
      setIsCancelling(false);
      setShowConfirmation(false);
    }
  };

  const handleCancelConfirmation = () => {
    setShowConfirmation(false);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-6 mb-4 hover:shadow-xl transition-shadow">
        {/* Room Header */}
        <div className="bg-orange-300 text-white p-4 rounded-t-lg -mx-6 -mt-6 mb-4">
          <div className="flex items-center justify-center mb-2">
            <span className="text-4xl">🏢</span>
          </div>
          <h3 className="text-xl font-bold text-center">
            {booking.roomId.name}
          </h3>
          <p className="text-center text-sm opacity-90">
            Floor: {booking.roomId.floor}
          </p>
        </div>

        {/* Room Description */}
        <p className="text-gray-600 text-sm mb-4">
          {booking.roomId.description}
        </p>

        {/* Status Badges */}
        <div className="flex gap-2 mb-4 flex-wrap">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              booking.status === "active"
                ? "bg-green-100 text-green-700"
                : booking.status === "cancelled"
                ? "bg-red-100 text-red-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {booking.status === "active" ? "✓ Active" : "✗ Cancelled"}
          </span>
          {booking.isFullDayBooking && (
            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
              ⏱️ Full Day
            </span>
          )}
        </div>

        {/* Booking Details */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <div className="flex items-start gap-3 mb-3">
            <span className="text-2xl">📅</span>
            <div>
              <p className="text-sm font-medium text-gray-700">Date</p>
              <p className="text-base font-semibold text-gray-900">
                {formatDate(booking.bookingDate)}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-2xl">⏰</span>
            <div>
              <p className="text-sm font-medium text-gray-700">Time</p>
              <p className="text-base font-semibold text-gray-900">
                {formatTimeDisplay()}
              </p>
            </div>
          </div>
        </div>

        {/* Capacity */}
        <p className="text-gray-700 mb-3">
          👥 Capacity: {booking.roomId.capacity}
        </p>

        {/* Booked On */}
        <p className="text-sm text-gray-500 mb-4">
          Booked on:{" "}
          {new Date(booking.createdAt).toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>

        {/* Cancel Button */}
        {booking.status === "active" && (
          <>
            <button
              onClick={handleCancelClick}
              disabled={!canCancel()}
              className={`w-full py-3 rounded-lg font-semibold transition ${
                canCancel()
                  ? "bg-red-400 hover:bg-red-500 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Cancel Booking
            </button>

            <p
              className={`text-xs mt-2 flex items-center justify-center gap-1 ${
                canCancel() ? "text-gray-500" : "text-red-500"
              }`}
            >
              {getCancellationMessage()}
            </p>
          </>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="text-center">
              {/* Warning Icon */}
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <svg
                  className="h-6 w-6 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Cancel Booking?
              </h3>

              <p className="text-sm text-gray-600 mb-6">
                Are you sure you want to cancel your booking for{" "}
                <span className="font-semibold">{booking.roomId.name}</span> on{" "}
                <span className="font-semibold">
                  {formatDate(booking.bookingDate)}
                </span>
                ? This action cannot be undone.
              </p>

              <div className="flex gap-3 justify-center">
                <button
                  onClick={handleCancelConfirmation}
                  disabled={isCancelling}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium disabled:opacity-50"
                >
                  No, Keep Booking
                </button>
                <button
                  onClick={handleConfirmCancel}
                  disabled={isCancelling}
                  className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-medium disabled:opacity-50 flex items-center gap-2"
                >
                  {isCancelling ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Cancelling...
                    </>
                  ) : (
                    "Yes, Cancel Booking"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BookingCard;
