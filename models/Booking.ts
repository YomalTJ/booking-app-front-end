import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide user ID"],
    },
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: [true, "Please provide room ID"],
    },
    bookingDate: {
      type: Date,
      required: [true, "Please provide booking date"],
    },
    startTime: {
      type: String, // Format: "HH:MM" (24-hour format)
      required: [true, "Please provide start time"],
    },
    endTime: {
      type: String, // Format: "HH:MM" (24-hour format)
      required: [true, "Please provide end time"],
    },
    isFullDayBooking: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["active", "cancelled", "completed"],
      default: "active",
    },
    notes: {
      type: String,
      default: "",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Index for faster queries
bookingSchema.index({ roomId: 1, bookingDate: 1 });
bookingSchema.index({ userId: 1, bookingDate: 1 });

export default mongoose.models.Booking ||
  mongoose.model("Booking", bookingSchema);
