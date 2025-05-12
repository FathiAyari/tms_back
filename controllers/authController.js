import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import upload from "../middleware/upload.js";

const JWT_SECRET = process.env.JWT_SECRET || 'yourSecretKey'; // use env in production

// @desc    Register user
// @route   POST /api/auth/signup
export const signup = async (req, res) => {
    const { username, email, password } = req.body;

    const { file } = req; // Multer will attach the uploaded file to req.file
    const image = file ? `/uploads/${file.filename}` : null; // Store the image URL

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        const newUser = new User({
            username,
            email,
            password,
            image, // Add the image field to the user document
        });

        await newUser.save(); // Save the new user to the database

        const token = jwt.sign({ id: newUser._id, role: newUser.role }, JWT_SECRET, { expiresIn: '1d' });
        res.status(201).json({
            token,
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                role: newUser.role,
                status: newUser.status,
                image: newUser.image, // Include the image in the response
            }
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};


// @desc    Login user
// @route   POST /api/auth/signin
export const signin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(500).json({ message: 'Utilisateur introuvable' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
        res.status(200).json({ token, user: { id: user._id, username: user.username, email: user.email, role: user.role,status:user.status,image:user.image } });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
