import React from "react";

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  bookingDetails: {
    date: string;
    startTime: string;
    endTime: string;
    isFullDay: boolean;
    duration: string;
  };
  isLoading?: boolean;
}

const VerificationModal: React.FC<VerificationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  bookingDetails,
  isLoading = false,
}) => {
  if (!isOpen) return null;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTimeTo12h = (time24: string): string => {
    const [hours, minutes] = time24.split(":").map(Number);
    const ampm = hours >= 12 ? "pm" : "am";
    const displayHours = hours % 12 || 12;
    return minutes === 0
      ? `${displayHours}${ampm}`
      : `${displayHours}:${minutes.toString().padStart(2, "0")}${ampm}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <span className="text-orange-600 text-lg">📅</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                Confirm Booking
              </h3>
              <p className="text-sm text-gray-600">
                Please verify your booking details
              </p>
            </div>
          </div>
        </div>

        {/* Booking Details */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Date:</span>
              <p className="font-medium text-gray-800">
                {formatDate(bookingDetails.date)}
              </p>
            </div>
            <div>
              <span className="text-gray-500">Duration:</span>
              <p className="font-medium text-gray-800">
                {bookingDetails.duration}
              </p>
            </div>
            <div className="col-span-2">
              <span className="text-gray-500">Time Slot:</span>
              <p className="font-medium text-gray-800">
                {bookingDetails.isFullDay
                  ? "Full Day (8:00am - 6:00pm)"
                  : `${formatTimeTo12h(
                      bookingDetails.startTime
                    )} - ${formatTimeTo12h(bookingDetails.endTime)}`}
              </p>
            </div>
          </div>

          {/* Note */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-700">
              💡 By confirming, you agree to our booking policies.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 px-4 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white font-semibold rounded-lg transition flex items-center justify-center gap-2 cursor-pointer"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Booking...
              </>
            ) : (
              "Confirm Booking"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerificationModal;
