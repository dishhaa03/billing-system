// billController.js
import { Bill } from "../model/bill.model.js";
import {Payment} from "../model/payment.model.js";
import { Product } from "../model/product.model.js";

// Add a new bill
export const addBill = async (req, res) => {
  try {
    const { user, products, totalAmount, totalPayableAmount, pendingAmount, payments, billDate, isPending, isCleared } = req.body;

    const newBill = new Bill({
      user,
      products,
      totalAmount,
      totalPayableAmount,
      pendingAmount,
      payments,
      billDate,
      isPending: true,
      isCleared: false,
    });

    const savedBill = await newBill.save();
    res.status(201).json(savedBill);
  } catch (error) {
    res.status(500).json({ error: "Failed to save bill." });
  }
};


export const updateBillIds = async (req, res) => {
  const { billId, productIds, paymentIds, userId } = req.body;
  // UserId task is remaining.

  try {
    // Update all products with the billId
    await Product.updateMany(
      { _id: { $in: productIds } }, // Match the product IDs
      { $set: { billid: billId } }    // Set the bill field
    );

    // Update all payments with the billId
    await Payment.updateMany(
      { _id: { $in: paymentIds } }, // Match the payment IDs
      { $set: { billid: billId } }    // Set the bill field
    );

    res.status(200).json({ message: "Bill IDs updated successfully!" });
  } catch (error) {
    console.error("Error updating bill IDs:", error);
    res.status(500).json({ error: "Failed to update bill IDs." });
  }
};

export const getAllBills = async (req, res) => {
  try {
    const bills = await Bill.find()
      .populate('user', 'name') // Populate user field with the user's name
      .sort({ billDate: -1 }); // Sort by billDate (latest first)

    res.status(200).json(bills);
  } catch (error) {
    console.error('Error fetching bills:', error);
    res.status(500).json({ error: 'Failed to fetch bills' });
  }
};