import express from "express";
import {
    addMessage,
    getMessages,
    getOneMessage,
    deleteMessage,
} from "../controllers/messageController.js";

const router = express.Router();

// ========================
// Message Collection Routes
// ========================
// POST / - Create a new message
router.post("/", addMessage);

// GET / - Retrieve all messages
router.get("/", getMessages);

// ========================
// Single Message Routes
// ========================
// GET /:id - Retrieve a single message by ID
router.get("/:id", getOneMessage);

// DELETE /:id - Delete a message by ID
router.delete("/:id", deleteMessage);

export default router;
