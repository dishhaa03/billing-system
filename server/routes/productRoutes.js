import express from "express";
import { addProduct } from "../controllers/productController.js";

const router = express.Router();

router.post("/api/products", addProduct);

export default router;
