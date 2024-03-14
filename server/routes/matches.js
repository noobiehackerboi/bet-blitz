const express = require('express');
const router = express.Router();

const Match = require('../models/Matches');
const User = require('../models/User');
const Bet = require('../models/Bet');

const { body, validationResult } = require('express-validator');

// Middleware to validate input using express-validator
const validateInput = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
};

// ROUTE 1: fetch all matches using GET (/routes/matches/all)
router.get('/all', async (req, res) => {

    try {
        // Find all matches
        let matches = await Match.find();
        res.json(matches);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

// ROUTE 2: create a match using PUT (/routes/matches/match)
router.put('/create', [
    // Input validation and sanitization using express-validator
    body('league', "Enter a valid League").trim().notEmpty(),
    body('team1', "Enter a valid team name").trim().notEmpty(),
    body('team2', "Enter a valid team name").trim().notEmpty(),
    body('venue', "Enter a valid venue").trim().notEmpty(),
    body('date', "Enter a valid date").isISO8601()
], validateInput, async (req, res) => {

    try {
        let success = false;
        const { league, team1, team2, venue, date } = req.body;
        let match = await Match.findOne({ league, team1, team2, date });
        if (match) {
            return res.status(400).json({ success, match, error: "Match already exists" });
        }

        match = await Match.create({
            league: league,
            team1: team1,
            team2: team2,
            venue: venue,
            date: date
        })

        success = true;
        res.json({ success, match });

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

// ROUTE 3: adding match result using PUT (/routes/matches/result)
router.put('/result', [
    body('matchId', "Enter valid matchID").isMongoId(),
    body('result', "Enter a valid team name").trim().notEmpty(),
], validateInput, async (req, res) => {

    try {
        let success = false;
        const { matchId, result } = req.body;

        // Update the match result in matches database
        await Match.findByIdAndUpdate(matchId, { result: result });

        // find all users which bet
        const bets = await Bet.find({ matchId });

        // Update user points
        for (const bet of bets) {
            let netChange = bet.netChange;
            let change = 0;
            if (bet.prediction === result) {
                change = bet.amount * 2; // winner
            } else {
                change = -bet.amount; // loser
            }

            // Update the net change in the bet document
            await Bet.findByIdAndUpdate(bet._id, { netChange: change });

            // update the user's points
            await User.findByIdAndUpdate(bet.userId, { $inc: { points: change - netChange } });
        }
        success = true;
        res.json({ success, message: "Match results updated Successfully" });

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

module.exports = router;