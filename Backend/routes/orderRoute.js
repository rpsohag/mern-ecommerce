import express from "express";
import {
  createOrder,
  getOrders,
  updateOrderStatus,
} from "../controllers/OrderController.js";
import { authMiddleware, checkIsAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/create", authMiddleware, createOrder);
router.get("/get", authMiddleware, getOrders);
router.put(
  "/update-status/:id",
  authMiddleware,
  checkIsAdmin,
  updateOrderStatus
);

export default router;
