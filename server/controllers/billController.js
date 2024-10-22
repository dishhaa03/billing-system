// import { Bill } from "../models/Bill.js";
// import { Product } from "../models/Product.js";
// import { User } from "../models/User.js";

// // Create a new bill
// export const createBill = async (req, res) => {
//   try {
//     const { userId, productIds, totalAmount, totalPayableAmount } = req.body;

//     // Check if user exists
//     const user = await User.findById(userId);
//     if (!user) return res.status(404).json({ error: "User not found" });

//     // Validate products
//     const products = await Product.find({ _id: { $in: productIds } });
//     if (products.length !== productIds.length) {
//       return res.status(400).json({ error: "Invalid product(s)" });
//     }

//     const bill = new Bill({
//       user: userId,
//       products: productIds,
//       totalAmount,
//       totalPayableAmount,
//       pendingAmount: totalPayableAmount,
//     });

//     const savedBill = await bill.save();
//     res.status(201).json(savedBill);
//   } catch (error) {
//     console.error("Error creating bill:", error);
//     res.status(500).json({ error: "Failed to create bill" });
//   }
// };



// Controller logic is not up to mark.
// I want different logic.