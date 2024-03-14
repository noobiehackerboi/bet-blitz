const mongoose = require('mongoose')
const { Schema } = mongoose;

const BetSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user', // Reference to the User Model
        required: true,
    },
    matchId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'match', // Reference to the Match Model
        required: true
    },
    amount: { // number of points bet
        type: Number,
        required: true
    },
    netChange: { // points change (+250,-100,etc)
        type: Number,
        default: 0,
        required: true
    },
    prediction: { // user's prediction
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
const Bet = mongoose.model('bet', BetSchema)
module.exports = Bet;