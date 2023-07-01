import mongoose from "mongoose";

const productCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        index: true
    }
},{
    timestamps: true,
    versionKey: false
})

export default mongoose.model("ProductCategory", productCategorySchema)