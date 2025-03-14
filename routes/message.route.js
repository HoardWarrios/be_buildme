import express from "express";
import {
  createMessage,
  getMessages,deleteAll
} from "../controllers/message.controller.js";
import { verifyToken } from "../middleware/jwt.js";

const router = express.Router();

router.post("/", verifyToken, createMessage);
router.get("/:id", verifyToken, getMessages);
router.delete("/",deleteAll);

export default router;
