import express from "express";
import {
    getUsers,
    getUserById,
    updateUserStatus,
    deleteUser,
    createUser,
} from "../controllers/userController.js";

const router = express.Router();

// ========================
// User Collection Routes
// ========================
// POST / - Create a new user
router.post("/", createUser);

// GET / - Retrieve all users
router.get("/", getUsers);

// ========================
// Single User Routes
// ========================
// GET /:id - Retrieve a single user by ID
router.get("/:id", getUserById);

// PATCH /:id/status - Update a user's status (active/inactive)
router.patch("/:id/status", updateUserStatus);

// DELETE /:id - Delete a user by ID
router.delete("/:id", deleteUser);

export default router;
