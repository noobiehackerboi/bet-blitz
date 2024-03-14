const express = require('express');
const router = express.Router();

const Mod = require('../models/Mod');

const { body, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');

const fetchMod = require('../middleware/fetchMod');

const Secret_key = process.env.SECRET_KEY;


// Middleware to validate input using express-validator
const validateInput = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
};


// ROUTE 1: create new moderator using POST (/routes/mods/create)
router.post('/create', fetchMod, [
    body('userId').notEmpty().trim().escape(),
    body('password').notEmpty().trim().escape()
], validateInput, async (req, res) => {
    try {
        let success = false;

        // checking that the user creating mod is already a mod
        const _id = req.user._id;
        const existingMod = Mod.findById(_id);
        if (!existingMod) {
            return res.status(401).json({ success, error: "Unauthorized Access" })
        }

        const { userId, password } = req.body;

        // check if the userId is already registered
        let mod = await Mod.findOne({ userId });
        if (mod) {
            return res.status(400).json({ success, error: "User already exists" });
        }

        // Generate Salt
        let salt = bcrypt.genSaltSync(10);

        // Create user and push to Database
        mod = await Mod.create({
            userId: userId,
            password: await bcrypt.hash(password, salt)
        })

        success = true;
        res.json({ success, message: "Moderator created successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// ROUTE 2: delete moderator using POST (/routes/mods/create)
router.delete('/:modId', fetchMod, async (req, res) => {
    try {
        // checking that the user creating mod is already a mod
        const _id = req.user._id;
        const existingMod = Mod.findById(_id);
        if (!existingMod) {
            return res.status(401).json({ success, error: "Unauthorized Access" })
        }

        const modId = req.params.modId;
        await Mod.findByIdAndDelete(modId);

        res.json({ message: "Moderator deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// ROUTE 3: get moderator list using GET (/routes/mods/mods)
// Get all moderators
router.get('/mods', fetchMod, async (req, res) => {
    try {
        // checking that the user creating mod is already a mod
        let success = false;
        const _id = req.user._id;
        const existingMod = Mod.findById(_id);
        if (!existingMod) {
            return res.status(401).json({ success, error: "Unauthorized Access" })
        }

        const moderators = await Mod.find().select('-password');
        success = true;
        res.json({ success, moderators });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// ROUTE 4: get a specific moderator using GET (/routes/mods/:modId)
// router.get('/:modId', fetchMod, async (req, res) => {
//     try {
//         // checking that the user creating mod is already a mod
//         let success = false;
//         const _id = req.user._id;
//         const existingMod = Mod.findById(_id);
//         if (!existingMod) {
//             return res.status(401).json({ success, error: "Unauthorized Access" })
//         }

//         const modId = req.params.modId;
//         const moderator = await Mod.findById(modId);
//         if (!moderator) {
//             return res.status(404).json({ message: "Moderator not found" });
//         }
//         success = true;
//         res.json({ success, moderator });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Internal Server Error" });
//     }
// });

// ROUTE 5: update moderator credentials using PUT (/routes/mods/create)
router.put('/:modId', fetchMod, async (req, res) => {
    try {
        // checking that the user creating mod is already a mod
        const _id = req.user._id;
        const existingMod = Mod.findById(_id);
        if (!existingMod) {
            return res.status(401).json({ success, error: "Unauthorized Access" })
        }

        const modId = req.params.modId;
        const { userId, password } = req.body;
        await Mod.findByIdAndUpdate(modId, { userId, password });

        res.json({ success: true, message: "Moderator updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// ROUTE 6: login moderator using POST (/routes/mods/login)
router.post('/login', async (req, res) => {
    try {
        let success = false;
        const { userId, password } = req.body;

        // Find the user by email
        const mod = await Mod.findOne({ userId });
        if (!mod) {
            return res.status(400).json({ success, error: "Invalid credentials" });
        }

        // Check Password
        const passwordCheck = await bcrypt.compare(password, mod.password);
        if (!passwordCheck) {
            return res.status(400).json({ success, error: "Invalid credentials" });
        }

        // Generate JWT
        const data = {
            user: {
                _id: mod._id
            }
        }
        success = true;
        const authToken = jwt.sign(data, Secret_key);

        res.json({ success, authToken });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// ROUTE 7: logout moderator using POST (/routes/mods/create)
// router.post('/logout', fetchMod, async (req, res) => {
//     try {
//         res.json({ message: "Moderator logged out successfully" });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Failed to logout moderator" });
//     }
// });

module.exports = router;
