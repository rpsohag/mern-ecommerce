import AsyncHandler from "express-async-handler";
import Coupon from "../models/Coupon.js";



export const createCoupon = AsyncHandler( async (req, res) => {
    try {
        const coupon = await Coupon.create(req.body);
        res.json(coupon)
    } catch (error) {
        throw new Error(error)
    }
})

export const getAllCoupons = AsyncHandler( async (req, res) => {
    res.send('get all coupon')
})

export const updateCoupon = AsyncHandler( async (req, res) => {
    res.send('update coupon')
})
export const deleteCoupon = AsyncHandler( async (req, res) => {
    res.send('update coupon')
})