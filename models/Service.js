import mongoose from "mongoose";

// Define the schema for the service
const serviceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    notes: {
        type: String,
        default: "",
        maxlength: 1000
    },
    region: {
        type: String,
        required: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create the model
const Service = mongoose.model('Service', serviceSchema);

export default Service;
