import mongoose, { Schema } from "mongoose";

// Define the User schema
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true, // Indexing for better query performance
    },
    contactNo: {
      type: String,
      trim: true,
    },
    bills: [
      {
        type: Schema.Types.ObjectId,
        ref: "Bill", // Reference to Bill model
      },
    ],
    totalPurchaseAmount: {
      type: Number,
      default: 0, // Default value of 0
    },
    totalPendingAmount: {
      type: Number,
      default: 0, // Default value of 0
    },
    pendingBills: [
      {
        type: Schema.Types.ObjectId,
        ref: "Bill", // Reference to Bill model
      },
    ],
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Export the User model
export const User = mongoose.model("User", userSchema);
