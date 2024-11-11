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

export const getBillById = async (req, res) => {
  const { billid } = req.params;
  console.log("billid: ", billid);

  try {
    const bill = await Bill.findById(billid)
      .populate('user') // Populate user details
      .populate('products payments'); // Populate product and payment details

    if (!bill) {
      return res.status(404).json({ error: 'Bill not found.' });
    }

    res.status(200).json(bill);
  } catch (error) {
    console.error('Error fetching bill:', error);
    res.status(500).json({ error: 'Failed to fetch bill.' });
  }
};

export const updateBill = async (req, res) => {
  const { billid } = req.params; // Extract bill ID
  const { products, newPaymentIds, totalAmount, totalPayableAmount } = req.body;

  try {
    // 1. Fetch the existing bill
    let bill = await Bill.findById(billid)
      .populate("products")
      .populate("payments");

    if (!bill) {
      return res.status(404).json({ error: "Bill not found" });
    }

    // 2. Handle product updates (Add/Update/Delete logic)
    const updatedProductIds = [];
    for (const product of products) {
      if (product._id) {
        // Update existing product
        await Product.findByIdAndUpdate(product._id, product);
        updatedProductIds.push(product._id);
      } else {
        // Add new product
        const newProduct = new Product(product);
        await newProduct.save();
        updatedProductIds.push(newProduct._id);
      }
    }
    
    // 3. Remove any products that were deleted
    const existingProductIds = bill.products.map(p => p._id.toString());
    const productsToRemove = existingProductIds.filter(
      id => !updatedProductIds.includes(id)
    );
    await Product.deleteMany({ _id: { $in: productsToRemove } });
    bill.products = updatedProductIds;

    bill.payments.push(...newPaymentIds);
    const totalPaid = await Payment.aggregate([
      { $match: { _id: { $in: bill.payments } } },
      { $group: { _id: null, totalPaid: { $sum: "$amount" } } }
    ]).then((result) => (result[0] ? result[0].totalPaid : 0));
    console.log("Total Paid: ", totalPaid);
    console.log("Total payable: ", totalPayableAmount);

    // 6. Update the bill with new values
    bill.totalAmount = totalAmount;
    bill.totalPayableAmount = totalPayableAmount;
    bill.pendingAmount = totalPayableAmount - totalPaid;
    bill.isCleared = bill.pendingAmount <= 0;

    const updatedBill = await bill.save();
    res.status(200).json({ message: "Bill updated successfully.", updatedBill});
  } catch (error) {
    console.error("Error updating bill:", error);
    res.status(500).json({ error: "Failed to update bill" });
  }
};