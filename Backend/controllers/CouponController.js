import AsyncHandler from "express-async-handler";
import Coupon from "../models/Coupon.js";

export const createCoupon = AsyncHandler(async (req, res) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.json(coupon);
  } catch (error) {
    throw new Error(error);
  }
});

export const getAllCoupons = AsyncHandler(async (req, res) => {
  try {
    const coupons = await Coupon.find();
    res.json(coupons);
  } catch (error) {
    throw new Error(error);
  }
});

export const singleCoupon = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const coupon = await Coupon.findById(id);
    res.json(coupon);
  } catch (error) {
    throw new Error(error);
  }
});
export const updateCoupon = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, expiry, discount } = req.body;
  try {
    const coupon = await Coupon.findByIdAndUpdate(
      id,
      {
        name,
        expiry,
        discount,
      },
      { new: true }
    );
    res.json(coupon);
  } catch (error) {
    throw new Error(error);
  }
});
export const deleteCoupon = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const coupon = await Coupon.findByIdAndDelete(id);
    res.json(coupon);
  } catch (error) {
    throw new Error(error);
  }
});
