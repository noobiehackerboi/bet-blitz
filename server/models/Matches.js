const mongoose = require('mongoose')
const { Schema } = mongoose;

const MatchSchema = new Schema({
    league: {
        type: String,
        required: true
    },
    date: { // match date
        type: String,
        required: true
    },
    team1: {
        type: String,
        required: true
    },
    team2: {
        type: String,
        required: true
    },
    venue: {
        type: String,
        required: true
    },
    result: { // winner of the match
        type: String,
        default: null // default null To be updated later
    },
    createdAt: {
        type: Date,

    }
});
const Match = mongoose.model('match', MatchSchema)
module.exports = Match;