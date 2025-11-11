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

// Virtual for remaining hours - calculated on demand
companyHoursSchema.virtual("remainingHours").get(function () {
  return this.totalHours - this.usedHours;
});

// Ensure virtual fields are serialized
companyHoursSchema.set("toJSON", { virtuals: true });
companyHoursSchema.set("toObject", { virtuals: true });

export default mongoose.models.CompanyHours ||
  mongoose.model("CompanyHours", companyHoursSchema);
