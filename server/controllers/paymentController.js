import { Payment } from "../model/payment.model.js"; // Import Payment model

// POST /api/payments - Create a new payment
export const createPayment = async (req, res) => {
  try {
    const { billId, amount, isCash, status, qrDetails = "" } = req.body;
    console.log(req.body);

    // Create a new payment object
    const newPayment = new Payment({
      billid: billId,
      amount,
      isCash,
      status, // Assume payment is successful for now
      qrDetails,
    });

    // Save the payment to the database
    const savedPayment = await newPayment.save();
    res.status(201).json(savedPayment);
  } catch (error) {
    console.error("Error creating payment:", error);
    res.status(500).json({ message: "Failed to create payment." });
  }
};
