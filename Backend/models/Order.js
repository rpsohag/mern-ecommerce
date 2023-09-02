import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        count: {
          type: Number,
        },
        color: {
          type: String,
        },
      },
    ],
    paymentIntent: {},
    orderStatus: {
      type: String,
      default: "not processed",
      enum: [
        "not processed",
        "Cash On delevery",
        "processing",
        "dispatched",
        "canceled",
        "delevered",
      ],
    },
    orderBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.model("Order", orderSchema);
