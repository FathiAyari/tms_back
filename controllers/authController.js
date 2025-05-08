import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'yourSecretKey'; // use env in production

// @desc    Register user
// @route   POST /api/auth/signup
export const signup = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        const newUser = await User.create({ username, email, password });

        const token = jwt.sign({ id: newUser._id, role: newUser.role }, JWT_SECRET, { expiresIn: '1d' });
        res.status(201).json({ token, user: { id: newUser._id, username, email, role: newUser.role,status:newUser.status } });
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
        res.status(200).json({ token, user: { id: user._id, username: user.username, email: user.email, role: user.role,status:user.status } });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
