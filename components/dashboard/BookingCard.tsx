"use client";

import React, { useState } from "react";
import {
  FaBuilding,
  FaCalendarAlt,
  FaUser,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import { FiX, FiCheck } from "react-icons/fi";
import Image from "next/image";
import { bookingService } from "@/services/bookingService";
import { toast } from "react-hot-toast";

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

interface BookingCardProps {
  booking: Booking;
  onUpdate?: () => void;
}

const BookingCard: React.FC<BookingCardProps> = ({ booking, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editStartDate, setEditStartDate] = useState(
    booking.startDate.split("T")[0]
  );
  const [editEndDate, setEditEndDate] = useState(booking.endDate.split("T")[0]);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    // Reset to original dates
    setEditStartDate(booking.startDate.split("T")[0]);
    setEditEndDate(booking.endDate.split("T")[0]);
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please log in to update bookings");
        return;
      }

      if (new Date(editStartDate) > new Date(editEndDate)) {
        toast.error("End date must be after start date");
        return;
      }

      await bookingService.updateBooking(
        token,
        booking._id,
        editStartDate,
        editEndDate
      );

      toast.success("Booking updated successfully");
      setIsEditing(false);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("Error updating booking:", error);
      toast.error("Failed to update booking. Please try again.");
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirmation(true);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please log in to delete bookings");
        return;
      }

      await bookingService.deleteBooking(token, booking._id);
      toast.success("Booking deleted successfully");
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("Error deleting booking:", error);
      toast.error("Failed to delete booking. Please try again.");
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirmation(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirmation(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden relative">
      {/* Action buttons */}
      <div className="absolute top-2 right-2 flex space-x-2 z-10">
        <button
          onClick={handleEdit}
          className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition cursor-pointer"
          title="Edit booking"
        >
          <FaEdit size={16} />
        </button>
        <button
          onClick={handleDeleteClick}
          className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition cursor-pointer"
          title="Delete booking"
          disabled={isDeleting}
        >
          {isDeleting ? (
            <span className="animate-spin">...</span>
          ) : (
            <FaTrash size={16} />
          )}
        </button>
      </div>

      {/* Room Image */}
      <div className="relative h-48 w-full">
        <Image
          src={booking.roomId.image || "/placeholder-office.jpg"}
          alt={booking.roomId.name}
          fill
          className="object-cover"
        />
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-gray-800">
            {booking.roomId.name}
          </h3>
        </div>

        {/* Booking details */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center text-gray-700">
            <FaCalendarAlt className="mr-2 text-gray-500" />
            <div>
              <span className="font-medium">From: </span>
              {formatDate(booking.startDate)}
            </div>
          </div>
          <div className="flex items-center text-gray-700">
            <FaCalendarAlt className="mr-2 text-gray-500" />
            <div>
              <span className="font-medium">To: </span>
              {formatDate(booking.endDate)}
            </div>
          </div>
          <div className="flex items-center text-gray-700">
            <FaUser className="mr-2 text-gray-500" />
            <div>
              <span className="font-medium">Capacity: </span>
              {booking.roomId.capacity} persons
            </div>
          </div>
        </div>

        {/* Room description */}
        <p className="text-gray-600 text-sm mt-4">
          {booking.roomId.description}
        </p>
      </div>

      {/* Edit Popup */}
      {isEditing && (
        <div className="absolute inset-0 bg-white bg-opacity-90 p-6 flex flex-col justify-center">
          <h3 className="text-lg font-bold mb-4">Edit Booking Dates</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={editStartDate}
                onChange={(e) => setEditStartDate(e.target.value)}
                className="w-full p-2 border rounded text-black"
                min={new Date().toISOString().split("T")[0]}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={editEndDate}
                onChange={(e) => setEditEndDate(e.target.value)}
                className="w-full p-2 border rounded text-black"
                min={editStartDate}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 mt-6">
            <button
              onClick={handleCancelEdit}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition cursor-pointer"
            >
              <FiX size={18} className="inline mr-1" />
              Cancel
            </button>
            <button
              onClick={handleUpdate}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition cursor-pointer"
            >
              <FiCheck size={18} className="inline mr-1" />
              Update
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Popup */}
      {showDeleteConfirmation && (
        <div className="absolute inset-0 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md text-center max-w-xs">
            <h3 className="text-lg font-bold mb-4 text-gray-800">
              Are you sure you want to delete this booking?
            </h3>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleDeleteCancel}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition cursor-pointer"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition cursor-pointer"
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingCard;
