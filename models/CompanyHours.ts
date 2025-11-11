import mongoose from "mongoose";

const companyHoursSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: [true, "Please provide company name"],
      unique: true,
    },
    totalHours: {
      type: Number,
      required: [true, "Please provide total hours"],
      default: 0,
    },
    usedHours: {
      type: Number,
      default: 0,
    },
    remainingHours: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    transactions: [
      {
        type: {
          type: String,
          enum: ["add", "use", "refund"],
          required: true,
        },
        hours: {
          type: Number,
          required: true,
        },
        description: String,
        bookingId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Booking",
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Calculate remaining hours before saving
companyHoursSchema.pre("save", function (next) {
  this.remainingHours = this.totalHours - this.usedHours;
  next();
});

export default mongoose.models.CompanyHours ||
  mongoose.model("CompanyHours", companyHoursSchema);
