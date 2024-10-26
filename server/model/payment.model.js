import mongoose, { Schema } from "mongoose";

// Define the Payment schema
const paymentSchema = new Schema(
  {
    billid: {
      type: Schema.Types.ObjectId,
      ref: "Bill", // Reference to the Bill model
      // required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0, // Ensure non-negative amount
    },
    date: {
      type: Date,
      default: Date.now, // Auto-set to the current date and time
    },
    isCash: {
      type: Boolean,
      required: true, // Whether the payment was made in cash or not
    },
    status: {
      type: String,
      enum: ["SUCCESS", "FAILED"],
    },
    qrDetails: {
      type: String, // Store QR code-related information or reference
      trim: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Export the Payment model
export const Payment = mongoose.model("Payment", paymentSchema);
