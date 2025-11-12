import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
    },
    otp: {
      type: String,
      required: [true, "OTP is required"],
    },
    type: {
      type: String,
      enum: ["password_reset"],
      default: "password_reset",
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    attempts: {
      type: Number,
      default: 0,
      max: 5, // Maximum 5 attempts
    },
    isUsed: {
      type: Boolean,
      default: false,
    },
    lastAttemptAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Create TTL index for automatic expiration
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Prevent multiple active OTPs for the same email and type
otpSchema.index({ email: 1, type: 1, isUsed: 1 });

// Add a method to check if OTP is still valid
otpSchema.methods.isValid = function () {
  return !this.isUsed && this.expiresAt > new Date() && this.attempts < 5;
};

export default mongoose.models.Otp || mongoose.model("Otp", otpSchema);
