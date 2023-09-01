import express from "express";
import {
  createBrand,
  deleteBrand,
  getAllBrand,
  getSingleBrand,
  updateBrand,
} from "../controllers/BrandController.js";
const router = express.Router();

router.post("/create", createBrand);
router.put("/update/:id", updateBrand);
router.get("/", getAllBrand);
router.get("/:id", getSingleBrand);
router.delete("/delete/:id", deleteBrand);

export default router;
