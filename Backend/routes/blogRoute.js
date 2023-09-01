import express from "express";
import {
  createBlog,
  deleteBlog,
  dislikeBlog,
  getAllBlogs,
  likeBlog,
  singleBlog,
  updateBlog,
  uploadImages,
} from "../controllers/BlogController.js";
import { authMiddleware, checkIsAdmin } from "../middlewares/authMiddleware.js";
import { blogImgResize, uploadPhoto } from "../middlewares/uploadImages.js";
const router = express.Router();

router.post("/create", createBlog);
router.get("/:id", singleBlog);
router.put("/update/:id", updateBlog);
router.put(
  "/upload/:id",
  authMiddleware,
  checkIsAdmin,
  uploadPhoto.array("images", 10),
  blogImgResize,
  uploadImages
);
router.get("/", getAllBlogs);
router.delete("/delete/:id", deleteBlog);
router.put("/likes", authMiddleware, likeBlog);
router.put("/dislikes", authMiddleware, dislikeBlog);

export default router;
