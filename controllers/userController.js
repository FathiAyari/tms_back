import User from "../models/User.js"; // Import your User model

// Get all users with optional search query
// Get all users with the role 'client'
export const getUsers = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit;

        // Fetch users with the 'client' role
        const users = await User.find({ role: "client" })
            .skip(skip)
            .limit(Number(limit)).select("username email status");

        // Calculate the total number of 'client' users
        const totalCount = await User.countDocuments({ role: "client" });

        // Calculate the total number of pages based on the limit
        const totalPages = Math.ceil(totalCount / limit);

        res.status(200).json({ users, totalPages, totalCount });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Get a single user by ID
export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ user });
    } catch (error) {
        console.error("Error fetching user by ID:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Update user status (active/inactive)
export const updateUserStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // status should be either 'active' or 'inactive'

        if (!status || (status !== 'active' && status !== 'inactive')) {
            return res.status(400).json({ message: "Invalid status value. Must be 'active' or 'inactive'" });
        }

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.status = status;
        await user.save();

        return res.status(200).json({ message: "User status updated successfully", user });
    } catch (error) {
        console.error("Error updating user status:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

// Delete a user by ID
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findByIdAndDelete(id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Create a new user
export const createUser = async (req, res) => {
    try {
        const { name, email, password, status = 'inactive' } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Name, email, and password are required" });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const newUser = new User({ name, email, password, status });

        await newUser.save();

        res.status(201).json({ message: "User created successfully", user: newUser });
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ message: "Server error" });
    }
};
