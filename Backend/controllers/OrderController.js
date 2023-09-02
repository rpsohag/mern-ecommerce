import AsyncHandler from "express-async-handler";
import uniqid from "uniqid";
import User from "../models/User.js";
import Cart from "../models/Cart.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

export const createOrder = AsyncHandler(async (req, res) => {
  const { COD, couponApplied } = req.body;
  const { _id } = req.user;
  try {
    if (!COD) throw new Error("Create cash order error");
    const user = await User.findById(_id);
    let userCart = await Cart.findOne({ orderBy: user._id });
    let finalAmount = 0;
    if (couponApplied && userCart.totalAfterDiscount) {
      finalAmount = userCart.cartTotal;
    } else {
      finalAmount = userCart.cartTotal;
    }
    let newOrder = await new Order({
      products: userCart.products,
      paymentIntent: {
        id: uniqid(),
        method: "COD",
        amount: finalAmount,
        status: "Cash On delevery",
        created_at: Date.now(),
        currency: "usd",
      },
      orderBy: user._id,
      orderStatus: "Cash On delevery",
    }).save();
    let update = userCart.products.map((item) => {
      return {
        updateOne: {
          filter: { _id: item.product._id },
          update: { $inc: { quantity: -item.count, sold: +item.count } },
        },
      };
    });
    const updated = await Product.bulkWrite(update, {});
    res.json({ message: "Order Created Successfully" });
  } catch (error) {
    throw new Error(error);
  }
});

export const getOrders = AsyncHandler(async (req, res) => {
  const { _id } = req.user;
  try {
    const userOrders = await Order.findOne({ orderBy: _id })
      .populate("products.product")
      .exec();

    res.json(userOrders);
  } catch (error) {
    throw new Error(error);
  }
});

export const updateOrderStatus = AsyncHandler(async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;
  console.log(status);
  const updateOrder = await Order.findByIdAndUpdate(
    id,
    {
      orderStatus: status,
      paymentIntent: {
        status: status,
      },
    },
    { new: true }
  );

  res.json(updateOrder);
});
