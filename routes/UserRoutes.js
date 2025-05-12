import express from "express";
import {
    getUsers,
    getUserById,
    updateUserStatus,
    updateUser,
    deleteUser,
    createUser,
} from "../controllers/userController.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// Collection routes
router.post("/", createUser);
router.get("/", getUsers);

// Single user routes
router.get("/:id", getUserById);
router.patch("/:id/status", updateUserStatus);
router.patch("/:id",upload.single("image") ,updateUser); // <-- newly added
router.delete("/:id", deleteUser);

export default router;
