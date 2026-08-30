import mongoose, { Schema, models } from "mongoose";

const deliverySchema = new Schema(
  {
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    customerAddress: { type: String, required: true },
    itemDescription: { type: String, required: true },
    status: {
      type: String,
      enum: ["SCHEDULED", "IN_TRANSIT", "DELAYED", "DELIVERED"],
      default: "SCHEDULED",
    },
    retailerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    dispatcherId: { type: Schema.Types.ObjectId, ref: "User" },
    riderId: { type: Schema.Types.ObjectId, ref: "User" },
    assignedAt: { type: Date },
    pickedUpAt: { type: Date },
    deliveredAt: { type: Date },
  },
  { timestamps: true }
);

export const Delivery = models.Delivery || mongoose.model("Delivery", deliverySchema);