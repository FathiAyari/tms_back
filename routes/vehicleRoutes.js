import express from "express";
import {
  addVehicle,
  updateVehicle,
  getVehicles,
  getOneVehicle,
  deleteVehicle,
  getDashboardData,
} from "../controllers/vehicleController.js";

const router = express.Router();

router.get("/dashboard", getDashboardData);

router.route("/").post(addVehicle).get(getVehicles);

router
  .route("/:id")
  .get(getOneVehicle)
  .patch(updateVehicle)
  .delete(deleteVehicle);

export default router;
