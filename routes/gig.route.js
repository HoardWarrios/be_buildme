import express from "express";
import {
  createGig,
  deleteGig,
  getGig,
  getGigs
} from "../controllers/gig.controller.js";
import { verifyToken } from "../middleware/jwt.js";

const router = express.Router();

router.post("/", verifyToken, createGig);//verifyToken: only a perticular type of user can do this operation
router.delete("/:id", verifyToken, deleteGig);
router.get("/single/:id", getGig);
router.get("/", getGigs);

export default router;
