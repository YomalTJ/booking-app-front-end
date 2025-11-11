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
    // Hour-based booking fields
    isHourBasedBooking: {
      type: Boolean,
      default: false,
    },
    hoursUsed: {
      type: Number,
      default: 0,
    },
    companyName: {
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
bookingSchema.index({ companyName: 1, status: 1 });

// Calculate hours used before saving
bookingSchema.pre("save", function (next) {
  if (this.isHourBasedBooking) {
    const [startHour, startMin] = this.startTime.split(":").map(Number);
    const [endHour, endMin] = this.endTime.split(":").map(Number);

    const startInMinutes = startHour * 60 + startMin;
    const endInMinutes = endHour * 60 + endMin;

    this.hoursUsed = (endInMinutes - startInMinutes) / 60;
  }
  next();
});

export default mongoose.models.Booking ||
  mongoose.model("Booking", bookingSchema);
