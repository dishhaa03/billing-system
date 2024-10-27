// billController.js
import { Bill } from "../model/bill.model.js";
import {Payment} from "../model/payment.model.js";
import { Product } from "../model/product.model.js";
import { User } from "../model/user.model.js";

// Add a new bill
export const addBill = async (req, res) => {
  try {
    const { user, products, totalAmount, totalPayableAmount, pendingAmount, payments, billDate, isPending, isCleared } = req.body;

    const newBill = new Bill({
      user: user,
      products,
      totalAmount,
      totalPayableAmount,
      pendingAmount,
      payments,
      billDate,
      isPending: isPending,
      isCleared: isCleared,
    });

    try{
      const savedBill = await newBill.save();
      console.log('savedBill:', savedBill);
      res.status(201).json(savedBill);
    }catch (error){
      console.log("Error in saving bll to the database", error);
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to save bill." });
  }
};


export const updateBillIds = async (req, res) => {
  const { billId, productIds, paymentIds, userId, totalAmount, pendingAmount } = req.body;
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

    // console.log(totalAmount, " ", pendingAmount);
    // console.log(typeof totalAmount, " ", typeof pendingAmount);
    console.log(userId);
    const updateUserFields = {
      $push: { bills: billId }, // Add billId to the bills array
      $inc: { totalPurchaseAmount: totalAmount }, // Increment total purchase amount
    };

    // If the bill has a pending amount, add it to pendingBills and update totalPendingAmount
    if (pendingAmount > 0) {
      updateUserFields.$push = { pendingBills: billId }; // Add bill to pendingBills
      updateUserFields.$inc.totalPendingAmount = pendingAmount; // Increment pending amount
    }

    // Step 4: Perform the user update
    await User.findByIdAndUpdate(userId, updateUserFields, { new: true });

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