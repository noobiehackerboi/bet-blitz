const mongoose = require('mongoose')
const { Schema } = mongoose;

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    points: {
        type: Number,
        default: 250,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});
const User = mongoose.model('user', UserSchema)
module.exports = User;