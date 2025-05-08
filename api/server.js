import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import orderRoutes from "../routes/OrderRoutes.js";
import messageRoutes from "../routes/MessagesRoutes.js";
import postsRoutes from "../routes/PostsRoutes.js";
import servicesRoutes from "../routes/ServicesRoutes.js";
import reviewsRoutes from "../routes/ReviewRoutes.js";
import dashboardRoutes from "../routes/DashboardRoutes.js";
import userRoutes from "../routes/UserRoutes.js";
import visitRoutes from "../routes/VisitsRouter.js";
import authRoutes from "../routes/auth.js";
import path from "path";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
let isConnected = false;

// MongoDB connection
const connectDB = async () => {
    if (isConnected) return;

    try {
        const db = await mongoose.connect(process.env.MONGO_URI);
        isConnected = db.connections[0].readyState;
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("Failed to connect to MongoDB", error.message);
        process.exit(1);
    }
};

// CORS setup
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || origin.startsWith("http://localhost") || origin.startsWith("http://127.0.0.1")) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: 'GET,POST,PUT,DELETE,PATCH',
    credentials: true,
}));

// Body parser for JSON requests
app.use(express.json());

// Test route
app.get("/", (req, res) => {
    res.send("Welcome to our backend!!");
});

app.use("/api/uploads", express.static(path.resolve("uploads")));
// API routes
app.use("/api/orders", orderRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api/services", servicesRoutes);
app.use("/api/reviews", reviewsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/users", userRoutes);
app.use("/api", visitRoutes);



// Handle 404 for undefined routes
app.all("*", (req, res) => {
    res.status(404).json({
        success: false,
        message: `Can't find ${req.originalUrl} on this server`,
    });
});

// Global error handler for unhandled errors
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: "An internal server error occurred",
    });
});

// Start the server and connect to MongoDB
const startServer = async () => {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
};

startServer();
