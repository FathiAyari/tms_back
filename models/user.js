import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'client'],
        default: 'client'
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'banned'],
        default: 'inactive'
    },
    // Image field added here
    image: {
        type: String, // Stores the URL of the image or the image file path
        default: "" // Optionally set a default value or leave empty
    }
});

// Encrypt password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
