import express from "express";
import { addBill, updateBillIds, getAllBills, getBillById, updateBill } from "../controllers/billController.js";

const router = express.Router();

router.get("/api/bills", getAllBills);
router.post("/api/bills", addBill);
router.post("/api/bills/update-bill-ids", updateBillIds);
router.get("/api/bills/:billid", getBillById);
router.put('/api/bills/:billid', updateBill);

export default router;
