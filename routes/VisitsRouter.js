import express from "express";
import { incrementVisit, getVisitCount } from "../controllers/visitsController.js"; // Import the visit controller

const router = express.Router();

// Route to increment visit count
router.get("/increment-visit", incrementVisit);

// Route to get the current visit count
router.get("/visit-count", getVisitCount);

export default router;
