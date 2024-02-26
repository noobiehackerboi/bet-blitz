const mongoose = require('mongoose')
const { Schema } = mongoose;

const MatchSchema = new Schema({
    team1: {
        type: String,
        required: true
    },
    team2: {
        type: String,
        required: true
    },
    venue: {
        type: String
    },
    matchdate: {
        type: Date,
        default: Date.now
    }
});
const Match = mongoose.model('match', UserSchema)
module.exports = Match;