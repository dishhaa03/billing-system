import mongoose, { Schema } from "mongoose";

// Define the Product schema
const productSchema = new Schema(
  {
    billid: {
      type: Schema.Types.ObjectId,
      ref: "Bill", // Reference to the Bill model
      // required: true,
    },
    itemName: {
      type: String,
      required: true, // Name of the product
      trim: true,
    },
    quantity: {
      type: Number,
      required: true, // Quantity of the product
      min: 1, // Minimum of 1 unit
    },
    sellingPrice: {
      type: Number,
      required: true, // Selling price per unit
      min: 0,
    },
    discountPercentage: {
      type: Number,
      default: 0, // Optional field, if not provided default is 0
      min: 0,
      max: 100,
    },
    totalPrice: {
      type: Number,
      required: true, // Total price for the product (quantity * discountedPrice)
      min: 0,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Export the Product model
export const Product = mongoose.model("Product", productSchema);
