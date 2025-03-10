import express from "express";
import {
  createPlan,
  deletePlan,
  getPlan,
  getPlans
} from "../controllers/plan.controller.js";
import { verifyToken } from "../middleware/jwt.js";

const router = express.Router();

router.post("/:gigId", verifyToken, createPlan);
router.delete("/:id", verifyToken, deletePlan);
router.get("/single/:id", getPlan);
router.get("/", getPlans);

export default router;
