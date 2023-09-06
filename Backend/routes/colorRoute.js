import express from "express";
import {
  createColor,
  deleteColor,
  getAllColor,
  getSingleColor,
  updateColor,
} from "../controllers/ColorController.js";
const router = express.Router();

router.post("/create", createColor);
router.put("/update/:id", updateColor);
router.get("/", getAllColor);
router.get("/:id", getSingleColor);
router.delete("/delete/:id", deleteColor);

export default router;
