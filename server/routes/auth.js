const express = require('express');
const router = express.Router();
const User = require('../models/User')
const { body, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const Secret_key = process.env.SECRET_KEY;

// ROUTE 1: creating user using POST (/routes/auth/createuser)
router.post('/createuser', [
    body('email', 'Enter a valid Email').notEmpty().isEmail(),
    body('password', 'Enter a valid Password').notEmpty().isLength({ min: 8 }),
    body('name', 'Enter a valid Name').notEmpty().isLength({ min: 3 }).isString()
], async (req, res) => {

    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).send({ errors: result.array() });
    }

    try {
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            res.status(400).json({ error: "Email already exists" });
        }

        // Hashing password
        let salt = await bcrypt.genSaltSync(10);

        // Creating user and pushing it to db
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: await bcrypt.hash(req.body.password, salt)
        })

        const data = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data, Secret_key);
        // console.log(authToken);
        res.json({ authToken });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;