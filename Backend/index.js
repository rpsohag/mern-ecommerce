import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import dbConnect from "./config/dbConnect.js";
import authRoute from "./routes/authRoute.js";
import productRoute from "./routes/productRoute.js";
import blogRoute from "./routes/blogRoute.js";
import brandRoute from "./routes/brandRoute.js";
import categoryRoute from "./routes/categoryRoute.js";
import blogCatRoute from "./routes/blogCatRoute.js";
import couponRoute from "./routes/couponRoute.js";
import orderRoute from "./routes/orderRoute.js";
import { errorHandler, notFound } from "./middlewares/errorHandler.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("hello from express");
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/api/user", authRoute);
app.use("/api/product", productRoute);
app.use("/api/blog", blogRoute);
app.use("/api/category", categoryRoute);
app.use("/api/brand", brandRoute);
app.use("/api/blog-category", blogCatRoute);
app.use("/api/coupon", couponRoute);
app.use("/api/order", orderRoute);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  dbConnect();
});
