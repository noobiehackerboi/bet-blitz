const express = require('express');
const router = express.Router();
const User = require('../models/User')
const { body, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');

const Secret_key = process.env.SECRET_KEY;

// ROUTE 1: creating user using POST (/routes/auth/createuser)
router.post('/createuser', [
    body('email', 'Enter a valid Email').isEmail(),
    body('password', 'Enter a valid Password of 8 characters').isLength({ min: 8 }),
    body('name', 'Enter a valid Name (Minimum 3 characters)').notEmpty().isLength({ min: 3 }).isString()
], async (req, res) => {

    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).send({ errors: result.array() });
    }

    try {
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ error: "Email already exists" });
        }

        // Hashing password
        let salt = bcrypt.genSaltSync(10);

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
        return res.json({ authToken });
    } catch (error) {
        console.error(error.message);
        return res.status(500).send("Internal Server Error");
    }
});

// ROUTE 2: authenticate a user using POST (/routes/auth/login)
router.post('/login', [
    body('email',"Enter a valid Email").isEmail(),
    body('password',"Enter a valid password of 8 characters").isLength({ min: 8 })
], async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).send({ errors: result.array() });
    }

    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Enter correct values" });
        }

        const passwordCheck = await bcrypt.compare(password, user.password);
        if (!passwordCheck) {
            return res.status(400).json({ error: "Enter correct values" });
        }

        const data = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data, Secret_key);
        return res.json({ authToken });
    } catch (error) {
        console.error(error.message);
        return res.status(500).send("Some error occured");
    }
})

// ROUTE 3: Get details of user through jwt-tokens (Login required)
router.post('/getuser', fetchuser, async (req, res) => {
    try {
        userId = req.user.Id;
        const user = await User.findOne({ userId }).select("-password");
        res.send(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some error occured");
    }
})

module.exports = router;