import express from "express";
import {
  getMessages,
  sendMessage
} from "../controllers/chatController.js";

const MessageRouter = express.Router();

// 🔹 Get all messages for a chat (appointment-based)
MessageRouter.get("/:appointmentId", getMessages);

// 🔹 Send message (optional REST API, mostly socket handles it)
MessageRouter.post("/", sendMessage);

export default MessageRouter;