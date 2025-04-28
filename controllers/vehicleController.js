import Vehicle from "../models/vehicleModel.js";

// Add a new vehicle
export const addVehicle = async (req, res) => {
  const { name, status, model } = req.body;

  try {
    if (!name || !status || !model) {
      return res
        .status(400)
        .json({ message: "All fields (name, status, model) are required" });
    }

    const existingVehicle = await Vehicle.findOne({ name, model });

    if (existingVehicle) {
      return res.status(400).json({
        success: false,
        message: "Vehicle with this name and model already exists",
      });
    }

    const vehicle = await Vehicle.create({ name, status, model });
    res.status(201).json({
      success: true,
      message: "Vehicle added successfully",
      vehicle,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add vehicle",
      error: error.message,
    });
  }
};

// Get all vehicles
export const getVehicles = async (req, res) => {
  const { search = "", limit = 10, page = 1, status = "" } = req.query;

  try {
    const limitNumber = parseInt(limit, 10);
    const pageNumber = parseInt(page, 10);

    const query = {};

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    if (status) {
      query.status = status;
    }

    const vehicles = await Vehicle.find(query)
      .sort({ createdAt: -1 })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    const totalCount = await Vehicle.countDocuments(query);

    if (vehicles.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Vehicles not found",
        data: [],
      });
    }

    res.status(200).json({
      success: true,
      vehicles,
      totalCount,
      totalPages: Math.ceil(totalCount / limitNumber),
      currentPage: pageNumber,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch vehicles",
      error: error.message,
    });
  }
};

// Get a single vehicle by ID
export const getOneVehicle = async (req, res) => {
  const { id } = req.params;

  try {
    const vehicle = await Vehicle.findById(id);
    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }
    res.status(200).json({
      success: true,
      vehicle,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch vehicle",
      error: error.message,
    });
  }
};

// Update vehicle details
export const updateVehicle = async (req, res) => {
  const { id } = req.params;
  const { name, status, model } = req.body;

  try {
    const vehicle = await Vehicle.findById(id);
    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    const existingVehicle = await Vehicle.findOne({
      name,
      model,
      _id: { $ne: id },
    });

    if (existingVehicle) {
      return res.status(400).json({
        success: false,
        message: "A vehicle with the same name and model already exists",
      });
    }

    vehicle.name = name || vehicle.name;
    vehicle.status = status || vehicle.status;
    vehicle.model = model || vehicle.model;

    const updatedVehicle = await vehicle.save();
    res.status(200).json({
      success: true,
      message: "Vehicle updated successfully",
      vehicle: updatedVehicle,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update vehicle",
      error: error.message,
    });
  }
};

// Delete a vehicle
export const deleteVehicle = async (req, res) => {
  const { id } = req.params;

  try {
    const vehicle = await Vehicle.findByIdAndDelete(id);
    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Vehicle deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete vehicle",
      error: error.message,
    });
  }
};

// Fetch dashboard statistics
export const getDashboardData = async (req, res) => {
  try {
    const stats = await Vehicle.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const totalCount = stats.reduce((total, stat) => total + stat.count, 0);
    const active = stats.find((stat) => stat._id === "Active")?.count || 0;
    const inactive = stats.find((stat) => stat._id === "Inactive")?.count || 0;
    const maintenance =
      stats.find((stat) => stat._id === "Maintenance")?.count || 0;

    res.status(200).json({
      success: true,
      stats: {
        total: totalCount,
        active,
        inactive,
        maintenance,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard data",
      error: error.message,
    });
  }
};
