import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide room name"],
    },
    description: {
      type: String,
      required: [true, "Please provide room description"],
    },
    capacity: {
      type: Number,
      required: [true, "Please provide room capacity"],
      min: 1,
    },
    floor: {
      type: Number,
      required: [true, "Please provide floor number"],
    },
    image: {
      type: String,
      default: "/room-placeholder.jpg",
    },
    availability: {
      type: Boolean,
      default: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Room || mongoose.model("Room", roomSchema);
