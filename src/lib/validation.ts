import { z } from "zod";

// Validates the payload when a Retailer creates a new delivery
export const createDeliverySchema = z.object({
  customerName: z.string().min(2, "Customer name is required"),
  customerPhone: z.string().min(5, "Valid phone number is required"),
  customerAddress: z.string().min(5, "Valid address is required"),
  itemDescription: z.string().min(2, "Item description is required"),
});

// Validates the payload when a Dispatcher assigns a rider or updates status
export const updateDeliverySchema = z.object({
  status: z.enum(["SCHEDULED", "IN_TRANSIT", "DELAYED", "DELIVERED"]).optional(),
  riderId: z.string().optional(),
  dispatcherId: z.string().optional(),
});

// Validates new user registration
export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["RETAILER", "DISPATCHER", "RIDER"]),
});

// Validates login credentials
export const loginSchema = z.object({
  email: z.email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});