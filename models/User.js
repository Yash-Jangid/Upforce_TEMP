const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    user_id: {
        type: Number,
        required: true,
        unique: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    mobile: {
        type: Number,
        required: true,
    },
    gender: {
        type: String,
        // required: true,
    },
    profile: {
        type: String,
        // required: true,
    },
    status: {
        type: String,
        required: true,
    },
    age: Number,
    location: String,
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
