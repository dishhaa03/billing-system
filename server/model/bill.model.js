import mongoose, { Schema } from "mongoose";

// Define the Bill schema
const billSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true,
    },
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product", // Reference to the Product model
        required: true,
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
      min: 0, // Ensure non-negative total
    },
    totalPayableAmount: {
        type: Number,
        required: true,
        min: 0, // Ensure non-negative total
        default: function () {
          return this.totalAmount; // Initially equal to the totalAmount
        },
      },

    pendingAmount: {
      type: Number,
      required: true,
      min: 0, // Ensure non-negative pending amount
      default: function () {
        return this.totalAmount; // Initially equal to the totalAmount
      },
    },
    payments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Payment", // Reference to Payment model
      },
    ],
    billDate: {
      type: Date,
      default: Date.now, // Auto-set to current date
    },
    isPending: {
      type: Boolean,
      default: true, // Bill starts as pending (draft)
    },
    isCleared: {
      type: Boolean,
      default: false, // Mark as cleared when payment is done
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps
  }
);

// Export the Bill model
export const Bill = mongoose.model("Bill", billSchema);
