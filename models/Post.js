import mongoose from "mongoose";
import User from "./user.js";

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 5000
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    image: {
        type: String,
        default: null
    },
    status: {
        type: String,
        enum: ["accepté", "refusé", "en cours"],
        default: "en cours"
    },
    publishedAt: {
        type: Date,
        default: Date.now
    }
});

const Post = mongoose.model("Post", postSchema);

export default Post;
