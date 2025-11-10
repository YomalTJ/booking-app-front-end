// BookingCard.tsx - Component to display booking details correctly

import React from "react";

interface BookingCardProps {
  booking: {
    _id: string;
    roomId: {
      name: string;
      floor: string;
      description: string;
      capacity: number;
    };
    bookingDate: string;
    startTime: string;
    endTime: string;
    isFullDayBooking: boolean;
    status: string;
    createdAt: string;
  };
  onCancel: (bookingId: string) => void;
}

const BookingCard: React.FC<BookingCardProps> = ({ booking, onCancel }) => {
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
      // Display business hours for full day bookings
      return `Full Day (${booking.startTime} - ${booking.endTime})`;
    }
    return `${booking.startTime} - ${booking.endTime}`;
  };

  // Check if booking can be cancelled (within 24 hours)
  const canCancel = () => {
    const bookingDate = new Date(booking.bookingDate);
    const now = new Date();
    const hoursDiff =
      (bookingDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    return hoursDiff >= 24 && booking.status === "active";
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      {/* Room Header */}
      <div className="bg-orange-500 text-white p-4 rounded-t-lg -mx-6 -mt-6 mb-4">
        <div className="flex items-center justify-center mb-2">
          <span className="text-4xl">🏢</span>
        </div>
        <h3 className="text-xl font-bold text-center">{booking.roomId.name}</h3>
        <p className="text-center text-sm opacity-90">Floor: {booking.roomId.floor}</p>
      </div>

      {/* Room Description */}
      <p className="text-gray-600 text-sm mb-4">{booking.roomId.description}</p>

      {/* Status Badges */}
      <div className="flex gap-2 mb-4">
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
            onClick={() => onCancel(booking._id)}
            disabled={!canCancel()}
            className={`w-full py-3 rounded-lg font-semibold transition ${
              canCancel()
                ? "bg-red-500 hover:bg-red-600 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Cancel Booking
          </button>

          {canCancel() ? (
            <p className="text-xs text-gray-500 mt-2 flex items-center justify-center gap-1">
              ⏳ Can be cancelled within 24 hours
            </p>
          ) : (
            <p className="text-xs text-red-500 mt-2 flex items-center justify-center gap-1">
              ⚠️ Cannot cancel (less than 24 hours to booking)
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default BookingCard;
