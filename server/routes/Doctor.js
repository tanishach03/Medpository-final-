const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const Doctors = require('./../models/Doctors')
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// @route   POST api/user
// @desc    Regiter User
// @access  Public
router.post(
    "/",
    [
        check("username", "Username is required").not().isEmpty(),
        check(
            "password",
            "Please enter a password with 8 or more character"
        ).isLength(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { username, password } = req.body;
        try {
            let user = await Doctors.findOne({
                $or: [{ username }],
            });
            if (user) {
                return res.status(400).json({ errors: [{ msg: "User already exists" }] });
            }
            user = new Doctors({
                username,
                password,
            });

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
            await user.save();

            const payload = {
                user: {
                    id: user.id,
                },
            };
            jwt.sign(
                payload,
                process.env.jwtSecret,
                { expiresIn: "1d" },
                (err, token) => {
                    if (err) throw err;
                    res.json({ token });
                }
            );
        } catch (error) {
            console.log(error.message);
            res.status(500).send("Serve Error");
        }
    }
);
router.post('/login', [
    check("username", "Please enter a valid username"),
    check("password", "Password is required").exists()
],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { username, password } = req.body;
        try {
            let user = await Doctors.findOne({ username });
            if (!user) {
                return res.status(400).json({ errors: [{ msg: "Invalid Creadentials" }] });
            }

            const payload = {
                user: {
                    id: user.id,
                },
            };

            const isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch) {
                return res
                    .status(400)
                    .json({ errors: [{ msg: 'Invalid Credentials' }] })
            }

            jwt.sign(
                payload,
                process.env.jwtSecret,
                { expiresIn: 3600000 },
                (err, token) => {
                    if (err) throw err;
                    res.json({ token });
                }
            );
        } catch (err) {
            console.log(err.message);
            res.status(500).send("Server Error");
        }
    })

module.exports = router