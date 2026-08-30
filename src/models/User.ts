import mongoose, { Schema, models } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Will store bcrypt hashes
    role: {
      type: String,
      enum: ["RETAILER", "DISPATCHER", "RIDER"],
      required: true,
    },
  },
  { timestamps: true }
);

// The `models.User || ...` check prevents Next.js from recompiling the model during hot-reloads
export const User = models.User || mongoose.model("User", userSchema);