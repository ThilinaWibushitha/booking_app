import express from "express";
import {
  getAllSlots,
  getSlotById,
  createSlot,
  updateSlot,
  deleteSlot,
} from "../controllers/slotController.js";

const router = express.Router();

router.get("/", getAllSlots);
router.get("/:id", getSlotById);
router.post("/", createSlot);
router.put("/:id", updateSlot);
router.delete("/:id", deleteSlot);

export default router;
