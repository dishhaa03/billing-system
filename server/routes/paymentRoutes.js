import express from "express";
// import { addBill } from "../controllers/billController.js";
import {createPayment} from "../controllers/paymentController.js";
const router = express.Router();

// router.post("/api/bills", addBill);
router.post("/api/payments", createPayment);

export default router;
