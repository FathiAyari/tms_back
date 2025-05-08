import express from "express";
import {
    addPost,
    getPosts,
    getOnePost,
    deletePost,
    updatePost,
    updatePostStatus,
} from "../controllers/postController.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// ========================
// Post Collection Routes
// ========================

// POST / - Create a new post
router.post("/", upload.single("image"), addPost);

// GET / - Retrieve all posts
router.get("/", getPosts);

// ========================
// Single Post Routes
// ========================

// GET /:id - Retrieve a single post by ID
router.get("/:id", getOnePost);

// PATCH /:id - Update a post by ID
router.patch("/:id", updatePost);

// PATCH /:id/status - Update only the status of a post
router.patch("/:id/status", updatePostStatus);

// DELETE /:id - Delete a post by ID
router.delete("/:id", deletePost);

export default router;
