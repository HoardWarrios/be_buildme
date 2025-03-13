import express from "express";
import {
  createConversation,
  getConversations,
  getSingleConversation,
  updateConversation,
} from "../controllers/conversation.controller.js";
import { verifyToken } from "../middleware/jwt.js";

const router = express.Router();

router.get("/", verifyToken, getConversations); // Get conversations
router.post("/", verifyToken, createConversation); //Create new conversation
router.get("/single/:id", verifyToken, getSingleConversation); // Get conversations from id
router.put("/:id", verifyToken, updateConversation); //Update conversation

export default router;
