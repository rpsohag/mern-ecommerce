import AsyncHandler from "express-async-handler";
import User from "../models/User.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

export const userCart = AsyncHandler(async (req, res) => {
  const { cart } = req.body;
  const { _id } = req.user;
  try {
    let products = [];
    const user = await User.findById(_id);
    // check if user already have product in cart
    const alreadyExistCart = await Cart.findOne({ orderby: _id });
    if (alreadyExistCart) {
      alreadyExistCart.remove();
    }

    for (let i = 0; i < cart.length; i++) {
      let object = {};
      object.product = cart[i]._id;
      object.count = cart[i].count;
      object.color = cart[i].color;
      let getPrice = await Product.findById(cart[i]._id).select("price").exec();
      object.price = getPrice.price;
      products.push(object);
    }
    let cartTotal = 0;
    for (let i = 0; i < products.length; i++) {
      cartTotal = cartTotal + products[i].price * products[i].count;
    }

    let newCart = await new Cart({
      products,
      cartTotal,
      orderBy: user?._id,
    }).save();

    return res.json({
      newCart: newCart,
    });
  } catch (error) {
    throw new Error(error);
  }
});

export const getUserCart = AsyncHandler(async (req, res) => {
  const { _id } = req.user;
  try {
    const cart = await Cart.findOne({ orderBy: _id }).populate(
      "products.product"
    );
    res.json(cart);
  } catch (error) {
    throw new Error(error);
  }
});

export const emptyCart = AsyncHandler(async (req, res) => {
  const { _id } = req.user;
  try {
    const user = await User.findOne(_id);
    const cart = await Cart.findByIdAndRemove({ orderBy: user._id });

    res.json(cart);
  } catch (error) {
    throw new Error(error);
  }
});
