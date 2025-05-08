import mongoose from "mongoose";
import Order from "../models/Order.js";
import Post from "../models/Post.js";
import Review from "../models/Review.js";
import Message from "../models/Message.js";     // <-- Add this
import Service from "../models/Service.js";     // <-- Add this
import User from "../models/User.js";
import Visit from "../models/Visit.js";           // <-- Add this

export const getData = async (req, res) => {
    try {
        const { userId } = req.query;
        const matchCondition = {};

        // If a userId is provided, filter by that user
        if (userId) {
            if (!mongoose.Types.ObjectId.isValid(userId)) {
                return res.status(400).json({ message: "Invalid User ID format" });
            }
            matchCondition.ownerId = new mongoose.Types.ObjectId(userId);
        }

        // Aggregation to get order counts by status
        const orderStats = await Order.aggregate([
            { $match: matchCondition },
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 },
                },
            },
        ]);

        const orders = {
            enAttenteColis: 0,
            confirmeeColis: 0,
            livreColis: 0,
            annuleeColis: 0,
        };

        // Map the order stats to the order statuses
        orderStats.forEach(({ _id, count }) => {
            switch (_id) {
                case "En attente":
                    orders.enAttenteColis = count;
                    break;
                case "Confirmée":
                    orders.confirmeeColis = count;
                    break;
                case "Livrée":
                    orders.livreColis = count;
                    break;
                case "Annulée":
                    orders.annuleeColis = count;
                    break;
            }
        });

        // Fetch the number of posts and reviews by userId, if userId exists
        const postQuery = userId ? { author: userId } : {};
        const reviewQuery = userId ? { user: userId } : {};

        const postCount = await Post.countDocuments(postQuery);
        const reviewCount = await Review.countDocuments(reviewQuery);

        // Get total message count (no filter)
        const messageCount = await Message.countDocuments();

        // Get total service count (no filter)
        const serviceCount = await Service.countDocuments();
        const count = (await Visit.findOne())?.count || 0;

        // Get the number of users with role "client"
        const clientCount = await User.countDocuments({ role: "client" });

        return res.status(200).json({
            orders,
            posts: postCount,
            reviews: reviewCount,
            messages: messageCount,
            services: serviceCount,
            clients: clientCount,
            views: count,
        });
    } catch (error) {
        console.error("Error fetching data:", error);
        return res.status(500).json({ message: "Server error" });
    }
};
