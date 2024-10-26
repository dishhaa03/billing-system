import express from "express";
import { addBill, updateBillIds, getAllBills } from "../controllers/billController.js";

const router = express.Router();

router.get("/api/bills", getAllBills);
router.post("/api/bills", addBill);
router.post("/api/bills/update-bill-ids", updateBillIds);

export default router;
