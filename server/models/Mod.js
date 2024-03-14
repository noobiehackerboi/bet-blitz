const mongoose = require('mongoose')
const { Schema } = mongoose;

const ModSchema = new Schema({
    userId: {
        type: String,
        required: true,
        unique: true // Ensures uniqueness of email
    },
    password: { // Hashed password
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
const Mod = mongoose.model('mod', ModSchema)
module.exports = Mod;