"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import {
  roomService,
  Room,
  AvailabilityResponse,
} from "@/services/roomService";
import { bookingService } from "@/services/bookingService";
import { Toaster, toast } from "react-hot-toast";

interface AvailableOfficesPopupProps {
  selectedDate: string;
  selectedDateISO: string;
  onClose: () => void;
}

interface BookingDates {
  [roomId: string]: {
    startDate: string;
    endDate: string;
    showDatePicker: boolean;
    availability: AvailabilityResponse;
  };
}

// Helper function to format dates for display
const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
};

const AvailableOffices: React.FC<AvailableOfficesPopupProps> = ({
  selectedDate,
  selectedDateISO,
  onClose,
}) => {
  const [availableRooms, setAvailableRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookingDates, setBookingDates] = useState<BookingDates>({});
  const [bookingInProgress, setBookingInProgress] = useState(false);
  const [selectedCapacity, setSelectedCapacity] = useState<string>("All");

  useEffect(() => {
    const fetchAvailableRooms = async () => {
      setIsLoading(true);
      try {
        // Pass the ISO format date to the service
        const rooms = await roomService.getAvailableRoomsForDate(
          selectedDateISO
        );
        setAvailableRooms(rooms);

        // Initialize bookingDates for each room
        const initialBookingDates: BookingDates = {};
        rooms.forEach((room) => {
          initialBookingDates[room._id] = {
            startDate: selectedDateISO,
            endDate: selectedDateISO,
            showDatePicker: false,
            availability: { isAvailable: true },
          };
        });
        setBookingDates(initialBookingDates);

        setError(null);
      } catch (err) {
        console.error("Error fetching available rooms:", err);
        setError("Failed to load available rooms. Please try again.");
        toast.error("Failed to load available rooms. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAvailableRooms();
  }, [selectedDateISO]);

  const toggleDatePicker = (roomId: string) => {
    setBookingDates((prev) => ({
      ...prev,
      [roomId]: {
        ...prev[roomId],
        showDatePicker: !prev[roomId].showDatePicker,
      },
    }));
  };

  const handleDateChange = async (
    roomId: string,
    field: "startDate" | "endDate",
    value: string
  ) => {
    // First update the date in state
    setBookingDates((prev) => ({
      ...prev,
      [roomId]: {
        ...prev[roomId],
        [field]: value,
      },
    }));

    // Then check availability for the new date range
    const updatedDates = {
      ...bookingDates[roomId],
      [field]: value,
    };

    // Only check availability if both dates are set
    if (updatedDates.startDate && updatedDates.endDate) {
      const availabilityResponse =
        await roomService.checkAvailabilityForDateRange(
          roomId,
          updatedDates.startDate,
          updatedDates.endDate
        );

      // Update availability status
      setBookingDates((prev) => ({
        ...prev,
        [roomId]: {
          ...prev[roomId],
          availability: availabilityResponse,
        },
      }));

      // Show toast with detailed information if not available
      if (
        !availabilityResponse.isAvailable &&
        availabilityResponse.conflictingDates
      ) {
        const conflicts = availabilityResponse.conflictingDates
          .map(
            (conflict) =>
              `${formatDate(conflict.startDate)} - ${formatDate(
                conflict.endDate
              )}`
          )
          .join(", ");

        toast.error(
          availabilityResponse.conflictingDates.length === 1
            ? `Room is already booked during: ${conflicts}`
            : `Room has ${availabilityResponse.conflictingDates.length} conflicting bookings: ${conflicts}`
        );
      }
    }
  };

  const handleBookNow = async (roomId: string) => {
    if (!bookingDates[roomId].showDatePicker) {
      toggleDatePicker(roomId);
      return;
    }

    const { startDate, endDate, availability } = bookingDates[roomId];

    if (!availability.isAvailable) {
      // Show detailed error message
      if (
        availability.conflictingDates &&
        availability.conflictingDates.length > 0
      ) {
        const conflicts = availability.conflictingDates
          .map(
            (conflict) =>
              `${formatDate(conflict.startDate)} - ${formatDate(
                conflict.endDate
              )}`
          )
          .join(", ");

        toast.error(
          availability.conflictingDates.length === 1
            ? `Room is already booked during: ${conflicts}`
            : `Room has ${availability.conflictingDates.length} conflicting bookings: ${conflicts}`
        );
      } else {
        toast.error("Room is not available for the selected dates");
      }
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      toast.error("End date must be after or equal to start date");
      return;
    }

    setBookingInProgress(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication required. Please log in.");
        return;
      }

      const bookingPromise = bookingService.createBooking(
        token,
        roomId,
        startDate,
        endDate
      );

      toast.promise(bookingPromise, {
        loading: "Processing your booking...",
        success: () => {
          setTimeout(() => {
            onClose();
          }, 2000);
          return `Room booked successfully from ${formatDate(
            startDate
          )} to ${formatDate(endDate)}!`;
        },
        error: (err) => {
          return err.message || "Failed to book room. Please try again.";
        },
      });

      await bookingPromise;
    } catch (err) {
      console.error("Booking error:", err);
    } finally {
      setBookingInProgress(false);
    }
  };

  // Create a function to render availability message
  const renderAvailabilityMessage = (roomId: string) => {
    const { availability, startDate, endDate } = bookingDates[roomId];

    if (startDate === endDate) {
      return null; // Don't show message for single day
    }

    if (availability.isAvailable) {
      return (
        <div className="mt-2">
          <div className="text-sm font-medium text-green-600">
            ✓ Room available from {formatDate(startDate)} to{" "}
            {formatDate(endDate)}
          </div>
        </div>
      );
    } else if (
      availability.conflictingDates &&
      availability.conflictingDates.length > 0
    ) {
      return (
        <div className="mt-2">
          <div className="text-sm font-medium text-red-600">
            ⚠️ Room unavailable due to existing bookings:
          </div>
          <ul className="text-xs text-red-500 ml-4 mt-1 list-disc">
            {availability.conflictingDates
              .slice(0, 3)
              .map((conflict, index) => (
                <li key={index}>
                  {formatDate(conflict.startDate)} -{" "}
                  {formatDate(conflict.endDate)}
                </li>
              ))}
            {availability.conflictingDates.length > 3 && (
              <li>
                + {availability.conflictingDates.length - 3} more conflicts
              </li>
            )}
          </ul>
        </div>
      );
    } else {
      return (
        <div className="mt-2">
          <div className="text-sm font-medium text-red-600">
            ⚠️ Room not available for these dates
          </div>
        </div>
      );
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 z-60 cursor-pointer"
          >
            <IoClose size={24} />
          </button>

          {/* Popup Content */}
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Available Offices on {selectedDate}
            </h2>

            <div className="mb-4">
              <label
                htmlFor="capacityFilter"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Filter by Capacity
              </label>
              <select
                id="capacityFilter"
                className="border border-gray-300 rounded-md px-3 py-2 w-full max-w-xs focus:outline-none focus:ring-2 focus:border-blue-500 text-black"
                value={selectedCapacity}
                onChange={(e) => setSelectedCapacity(e.target.value)}
              >
                <option value="All">All</option>
                {Array.from({ length: 19 }, (_, i) => i + 2).map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? "person" : "persons"}
                  </option>
                ))}
              </select>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center h-48">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="text-red-500 text-center p-4">{error}</div>
            ) : availableRooms.length === 0 ? (
              <div className="text-center p-8">
                <p className="text-gray-600 text-lg">
                  No available offices on this date.
                </p>
                <p className="text-gray-500 mt-2">
                  Please select another date or check back later.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {availableRooms
                  .filter((room) =>
                    selectedCapacity === "All"
                      ? true
                      : room.capacity === Number(selectedCapacity)
                  )
                  .map((room) => (
                    <div
                      key={room._id}
                      className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow"
                    >
                      <div className="relative h-48 w-full">
                        <Image
                          src={room.image || "/placeholder-office.jpg"}
                          alt={room.name}
                          fill
                          className="object-cover"
                          onError={(e) => {
                            // Fallback for image loading errors
                            const target = e.target as HTMLImageElement;
                            target.src = "/placeholder-office.jpg";
                          }}
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                          {room.name}
                        </h3>
                        <p className="text-gray-600 text-sm mb-2">
                          {room.description}
                        </p>
                        <div className="flex justify-between items-center mt-2">
                          <div className="text-gray-700">
                            <span className="font-medium">Capacity:</span>{" "}
                            {room.capacity} persons
                          </div>
                          <div className="text-blue-600 font-bold">
                            Available
                          </div>
                        </div>

                        {/* Date Selection UI */}
                        {bookingDates[room._id]?.showDatePicker && (
                          <div className="mt-3 space-y-2 border-t pt-3 border-gray-200">
                            <div className="flex flex-col space-y-2">
                              <label className="text-sm text-gray-600 font-medium">
                                From:
                              </label>
                              <input
                                type="date"
                                className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:border-blue-500 text-black"
                                value={
                                  bookingDates[room._id]?.startDate ||
                                  selectedDateISO
                                }
                                min={selectedDateISO} // Can't book before selected date
                                onChange={(e) =>
                                  handleDateChange(
                                    room._id,
                                    "startDate",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                            <div className="flex flex-col space-y-2">
                              <label className="text-sm text-gray-600 font-medium">
                                To:
                              </label>
                              <input
                                type="date"
                                className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:border-blue-500 text-black"
                                value={
                                  bookingDates[room._id]?.endDate ||
                                  selectedDateISO
                                }
                                min={
                                  bookingDates[room._id]?.startDate ||
                                  selectedDateISO
                                } // Can't end before start date
                                onChange={(e) =>
                                  handleDateChange(
                                    room._id,
                                    "endDate",
                                    e.target.value
                                  )
                                }
                              />
                            </div>

                            {/* Enhanced availability message */}
                            {renderAvailabilityMessage(room._id)}
                          </div>
                        )}

                        <button
                          className={`w-full mt-4 py-2 rounded-md transition cursor-pointer ${
                            bookingInProgress ||
                            (bookingDates[room._id]?.showDatePicker &&
                              !bookingDates[room._id]?.availability.isAvailable)
                              ? "bg-gray-400 text-gray-100 cursor-not-allowed"
                              : "bg-blue-500 text-white hover:bg-blue-600"
                          }`}
                          onClick={() => handleBookNow(room._id)}
                          disabled={
                            bookingInProgress ||
                            (bookingDates[room._id]?.showDatePicker &&
                              !bookingDates[room._id]?.availability.isAvailable)
                          }
                        >
                          {bookingInProgress
                            ? "Processing..."
                            : bookingDates[room._id]?.showDatePicker &&
                              !bookingDates[room._id]?.availability.isAvailable
                            ? "Unavailable for Selected Dates"
                            : bookingDates[room._id]?.showDatePicker
                            ? "Confirm Booking"
                            : "Book Now"}
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AvailableOffices;
