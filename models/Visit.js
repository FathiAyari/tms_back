import mongoose from "mongoose";

// Define the schema for the Visit model
const visitSchema = new mongoose.Schema({
    count: { type: Number, default: 0 }, // Count of visits
});

// Create the Visit model based on the schema
const Visit = mongoose.model("Visit", visitSchema);

export default Visit;
