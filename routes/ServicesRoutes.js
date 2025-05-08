import express from "express";
import {
    addService,
    getServices,
    getOneService,
    updateService,
    deleteService,
} from "../controllers/serviceController.js";

const router = express.Router();

// ========================
// Service Collection Routes
// ========================
// POST / - Create a new service
router.post("/", addService);

// GET / - Retrieve all services
router.get("/", getServices);

// ========================
// Single Service Routes
// ========================
// GET /:id - Retrieve a single service by ID
router.get("/:id", getOneService);

// PATCH /:id - Update a service by ID
router.patch("/:id", updateService);

// DELETE /:id - Delete a service by ID
router.delete("/:id", deleteService);

export default router;
