import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Vehicle name is required"],
      trim: true,
    },
    status: {
      type: String,
      required: [true, "Vehicle status is required"],
      enum: {
        values: ["Active", "Inactive", "Maintenance"],
        message: "Status must be 'Active', 'Inactive' or 'Maintenance'",
      },
    },
    model: {
      type: String,
      required: [true, "Vehicle model is required"],
      trim: true,
    },
  },
  { timestamps: true }
);

const Vehicle = mongoose.model("Vehicle", vehicleSchema);

export default Vehicle;
