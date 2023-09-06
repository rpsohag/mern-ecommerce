import express from "express";
import {
  createContact,
  deleteContact,
  getAllContact,
  getSingleContact,
} from "../controllers/ContactController.js";
const router = express.Router();

router.post("/create", createContact);
router.get("/", getAllContact);
router.get("/:id", getSingleContact);
router.delete("/delete/:id", deleteContact);

export default router;
