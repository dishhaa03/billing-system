import express from "express";
import { createBill } from "../controllers/billController.js";

const router = express.Router();

router.post("/api/bills", createBill);

export default router;
