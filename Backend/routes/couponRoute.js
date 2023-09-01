import express from "express";
import {
  createCoupon,
  deleteCoupon,
  getAllCoupons,
  singleCoupon,
  updateCoupon,
} from "../controllers/CouponController.js";

const router = express.Router();

router.get("/", getAllCoupons);
router.post("/create", createCoupon);
router.get("/:id", singleCoupon);
router.put("/:id", updateCoupon);
router.delete("/:id", deleteCoupon);

export default router;
