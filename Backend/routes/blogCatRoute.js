import express from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategory,
  getSingleCategory,
  updateCategory,
} from "../controllers/BlogCategoryController.js";
const router = express.Router();

router.post("/create", createCategory);
router.put("/update/:id", updateCategory);
router.get("/", getAllCategory);
router.get("/:id", getSingleCategory);
router.delete("/delete/:id", deleteCategory);

export default router;
