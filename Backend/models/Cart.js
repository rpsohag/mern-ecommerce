import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product"
            },
            count: {
                type: Number
            },
            color: {
                type: String
            },
            price: {
                type: Number
            }
        }
    ],
    cartTotal : Number,
    totalAfterDiscount: Number,
    orderBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
},{
    timestamps: true,
    versionKey: false
})

export default mongoose.model("Cart", cartSchema)