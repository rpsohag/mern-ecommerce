import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  uploadImages,
} from "../controllers/ProductController.js";
import { authMiddleware, checkIsAdmin } from "../middlewares/authMiddleware.js";
import { addToWishList } from "../controllers/WishListController.js";
import { productRating } from "../controllers/ProductRatingController.js";
import { productImgResize, uploadPhoto } from "../middlewares/uploadImages.js";
const router = express.Router();

router.post("/create", authMiddleware, checkIsAdmin, createProduct);
router.get("/:id", authMiddleware, checkIsAdmin, getSingleProduct);
router.get("/", authMiddleware, checkIsAdmin, getAllProducts);
router.put("/update/:id", authMiddleware, checkIsAdmin, updateProduct);
router.put(
  "/upload/:id",
  authMiddleware,
  checkIsAdmin,
  uploadPhoto.array("images", 10),
  productImgResize,
  uploadImages
);
router.put("/wishlist", authMiddleware, addToWishList);
router.put("/rating", authMiddleware, productRating);
router.delete("/delete/:id", authMiddleware, checkIsAdmin, deleteProduct);

export default router;
