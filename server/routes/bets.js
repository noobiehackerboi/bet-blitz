const express = require('express');
const router = express.Router();

const Bet = require('../models/Bet');
const User = require('../models/User');

const { body, validationResult } = require('express-validator');
const fetchuser = require('../middleware/fetchuser');

// Middleware to validate input using express-validator
const validateInput = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
};

// ROUTE 1: place bet using POST (/routes/bets/bet)
router.post('/bet', fetchuser, [
    // Input validation and sanitization using express-validator
    body('matchId').notEmpty(),
    body('amount').isInt({ min: 1 }),
    body('prediction').trim().notEmpty(),
], validateInput, async (req, res) => {

    try {
        let success = false;
        const { matchId, amount, prediction } = req.body;
        const userId = req.user._id;

        // Find user by ID
        let user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({ success, error: "User not found" });
        }

        // Check if the user has enough points for the bet
        if (amount > user.points) {
            return res.status(400).json({ success, error: "Insufficient points" });
        }


        // Check if the user has already placed a bet for this match
        let bet = await Bet.findOne({ userId, matchId });
        if (bet) {
            return res.status(400).json({ success, error: "You have already placed a bet for this match" });
        }

        // Create new bet and push to Database
        bet = await Bet.create({
            userId: userId,
            matchId: matchId,
            amount: amount,
            prediction: prediction
        })

        success = true;
        user.points -= amount;
        await user.save();

        res.json({ success, bet });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

// ROUTE 2: fetch bets of user using POST (/routes/bets/user)
router.get('/user', fetchuser, async (req, res) => {

    try {
        // Find all bets for the user
        const matches = await Bet.find({ userId: req.user._id }).populate('matchId');
        res.json({ success: true, matches });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

module.exports = router;