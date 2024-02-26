const mongoose = require('mongoose')
const { Schema } = mongoose;

const BetSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    matchId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'match',
        required: true
    },
    pointsbet: {
        type: Number,
        required: true
    },
    teamselected: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});
const Bet = mongoose.model('bet', UserSchema)
module.exports = Bet;