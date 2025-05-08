import mongoose from "mongoose";


// Define the schema for the message
const messageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        match: [/\S+@\S+\.\S+/, 'Please enter a valid email address']
    },
    subject: {
        type: String,
        required: true,
        trim: true
    },
    message: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 1000
    },
    sentAt: {
        type: Date,
        default: Date.now
    }
});

// Create the model
const Message = mongoose.model('Message', messageSchema);

export  default  Message;
