import express from "express";
import {
  addOrder,
  updateOrder,
  getOrders,
  getOneOrder,
  deleteOrder,
  getDashboardData,
} from "../controllers/orderController.js";

const router = express.Router();

// ========================
// Dashboard Route
// ========================
// GET /dashboard - Get order-related statistics
router.get("/dashboard", getDashboardData);

// ========================
// Order Collection Routes
// ========================
// POST / - Create a new order
router.post("/", addOrder);

// GET / - Retrieve all orders
router.get("/", getOrders);

// ========================
// Single Order Routes
// ========================
// GET /:id - Retrieve a single order by ID
router.get("/:id", getOneOrder);

// PATCH /:id - Update an order by ID
router.patch("/:id", updateOrder);

// DELETE /:id - Delete an order by ID
router.delete("/:id", deleteOrder);

export default router;
