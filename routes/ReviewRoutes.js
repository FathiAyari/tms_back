import express from "express";
import {
    addReview,
    getReviews,
    getOneReview,
    deleteReview,
    updateReview,
} from "../controllers/reviewController.js";

const router = express.Router();

// ========================
// Review Collection Routes
// ========================

// POST / - Create a new review
router.post("/", addReview);

// GET / - Retrieve all reviews
router.get("/", getReviews);

// ========================
// Single Review Routes
// ========================

// GET /:id - Retrieve a single review by ID
router.get("/:id", getOneReview);

// PATCH /:id - Update a review by ID
router.patch("/:id", updateReview);

// DELETE /:id - Delete a review by ID
router.delete("/:id", deleteReview);

export default router;
