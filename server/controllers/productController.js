// productController.js
import { Product } from "../model/product.model.js";

// Add a new product
export const addProduct = async (req, res) => {
  try {
    const product = new Product(req.body); // Save the product without bill ID
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ error: "Failed to add product." });
  }
};
