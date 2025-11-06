"use client";

import React, { useEffect, useState } from "react";
import { AvailableOfficesProps } from "./types";
import { bookingService } from "@/services/bookingService";
import toast from "react-hot-toast";

interface Room {
  _id: string;
  name: string;
  capacity: number;
  floor: number;
  description: string;
}

interface BookingDataLocal {
  startTime: string;
  endTime: string;
  isFullDay: boolean;
}

const AvailableOffices: React.FC<AvailableOfficesProps> = ({
  selectedDate,
  onClose,
  bookingData,
}: AvailableOfficesProps) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedOffice, setSelectedOffice] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    const loadRooms = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/rooms/list");
        if (!response.ok) throw new Error("Failed to load rooms");

        const data = await response.json();
        setRooms(data.rooms);
      } catch (error) {
        console.error("Error loading rooms:", error);
        toast.error("Failed to load available offices");
      } finally {
        setIsLoading(false);
      }
    };

    loadRooms();
  }, []);

  const handleBooking = async () => {
    if (!selectedOffice) {
      toast.error("Please select an office");
      return;
    }

    if (!selectedDate) {
      toast.error("No date selected");
      return;
    }

    setIsBooking(true);
    try {
      console.log("Booking with date string:", selectedDate);

      const result = await bookingService.createBooking({
        roomId: selectedOffice,
        bookingDate: selectedDate, // Already in YYYY-MM-DD format
        startTime: bookingData?.startTime || "00:00",
        endTime: bookingData?.endTime || "23:59",
        isFullDayBooking: bookingData?.isFullDay || false,
      });

      toast.success("Booking created successfully!");
      onClose();
      // Refresh page to show updated bookings
      window.location.href = "/dashboard";
    } catch (error: any) {
      toast.error(error.message || "Failed to create booking");
    } finally {
      setIsBooking(false);
    }
  };

  const getDateDisplay = (): string => {
    if (!selectedDate) return "No date selected";

    // selectedDate is already in YYYY-MM-DD format
    const date = new Date(selectedDate + "T00:00:00");
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50 pointer-events-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-96 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-orange-50 to-white border-b border-orange-200 p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Available Offices
              </h2>
              <p className="text-gray-600 mt-1">
                Date: {getDateDisplay()} | Time:{" "}
                {bookingData?.isFullDay
                  ? "Full Day"
                  : `${bookingData?.startTime || "N/A"} - ${
                      bookingData?.endTime || "N/A"
                    }`}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        {/* Offices List */}
        <div className="p-6 space-y-4">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-orange-500 mx-auto"></div>
              <p className="text-gray-600 mt-2">Loading offices...</p>
            </div>
          ) : rooms.length === 0 ? (
            <p className="text-gray-600 text-center py-8">
              No offices available
            </p>
          ) : (
            rooms.map((office) => (
              <button
                key={office._id}
                onClick={() => setSelectedOffice(office._id)}
                className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                  selectedOffice === office._id
                    ? "border-orange-500 bg-orange-50"
                    : "border-gray-200 hover:border-orange-300"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {office.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {office.description}
                    </p>
                    <div className="flex gap-4 mt-2 text-sm text-gray-600">
                      <span>👥 Capacity: {office.capacity}</span>
                      <span>🏢 Floor: {office.floor}</span>
                    </div>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      selectedOffice === office._id
                        ? "border-orange-500 bg-orange-500"
                        : "border-gray-300"
                    }`}
                  >
                    {selectedOffice === office._id && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleBooking}
            disabled={!selectedOffice || isBooking}
            className="flex-1 px-4 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white font-semibold rounded-lg transition"
          >
            {isBooking ? "Booking..." : "Book Office"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AvailableOffices;
