import mongoose from "mongoose";
import User from "./user.js";

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    message: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 1000
    },
    review: {
        type: String,
        enum: ["bon", "moyen", "mauvais"], // good, medium, bad
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Review = mongoose.model("Review", reviewSchema);

export default Review;
