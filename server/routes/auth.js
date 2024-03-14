const express = require('express');
const router = express.Router();

const User = require('../models/User')

const { body, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');

const fetchuser = require('../middleware/fetchuser');

const Secret_key = process.env.SECRET_KEY;

// Middleware to validate input using express-validator
const validateInput = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
};

// ROUTE 1: create user using POST (/routes/auth/createuser)
router.post('/create', [
    // Input validation and sanitization using express-validator
    body('email', 'Enter a valid Email').isEmail().normalizeEmail(),
    body('password', 'Enter a valid Password of 8 characters').isLength({ min: 8 }),
    body('name', 'Enter a valid Name').trim().notEmpty()
], validateInput, async (req, res) => {

    try {
        let success = false;

        // check if the email is already registered
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ success, error: "User already exists" });
        }

        // Generate Salt
        let salt = bcrypt.genSaltSync(10);

        // Create user and push to Database
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: await bcrypt.hash(req.body.password, salt)
        })

        // Generate JWT
        const data = {
            user: {
                _id: user._id
            }
        }
        success = true;
        const authToken = jwt.sign(data, Secret_key);

        res.json({ success, authToken });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

// ROUTE 2: authenticate user using POST (/routes/auth/login)
router.post('/login', [
    // Input validation and sanitization using express-validator
    body('email', "Enter a valid Email").isEmail().normalizeEmail(),
    body('password', "Enter a valid password of 8 characters").isLength({ min: 8 })
], validateInput, async (req, res) => {

    try {
        let success = false;
        const { email, password } = req.body;

        // Find the user by email
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success, error: "Invalid credentials" });
        }

        // Check Password
        const passwordCheck = await bcrypt.compare(password, user.password);
        if (!passwordCheck) {
            return res.status(400).json({ success, error: "Invalid credentials" });
        }

        // Generate JWT
        const data = {
            user: {
                _id: user._id
            }
        }
        success = true;
        const authToken = jwt.sign(data, Secret_key);

        res.json({ success, authToken });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

// ROUTE 3: Get details of user through jwt-tokens (Login required)
router.post('/getuser', fetchuser, async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId).select("-password");
        res.json({ success: true, user });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

module.exports = router;