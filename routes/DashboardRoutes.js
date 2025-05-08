import express from "express";
import {
    getData,
} from "../controllers/dashboardController.js";

const router = express.Router();

// ========================
// Message Collection Routes
// ========================
// POST / - Create a new message

router.get("/", getData);
export default router;
