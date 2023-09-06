import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["submit"],
      default: "submit",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.model("Contact", contactSchema);
