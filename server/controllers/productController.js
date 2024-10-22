import { Product } from "../models/Product.js";

// Add a new product
export const addProduct = async (req, res) => {
  try {
    const { itemName, quantity, sellingPrice, discountPercentage } = req.body;

    const discountedPrice = sellingPrice - (sellingPrice * discountPercentage) / 100;
    const totalPrice = quantity * discountedPrice;

    const product = new Product({
      itemName,
      quantity,
      sellingPrice,
      discountPercentage,
      discountedPrice,
      totalPrice,
    });

    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ error: "Failed to add product" });
  }
};
