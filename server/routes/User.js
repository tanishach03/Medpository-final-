const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const User = require('./../models/User')
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Document = require('./../models/Document')
const auth = require('./../middleware/auth')

// @route   POST api/user/register
// @desc    Regiter User
// @access  Public
router.post(
    "/register",
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
            let user = await User.findOne({
                $or: [{ username }],
            });
            if (user) {
                return res.status(400).json({ errors: [{ msg: "User already exists" }] });
            }
            user = new User({
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

// @route   POST api/user/login
// @desc    Regiter User
// @access  Public
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
            let user = await User.findOne({ username });
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

// @route   GET api/user
// @desc    Get User data for Dashboard
// @access  Private
router.get('/', auth, async (req, res) => {
    console.log('just got recked!')
    const user = await User.findById(req.user.id).select('-password')
    return res.json(user)
})

// @route   PUT api/user
// @desc    Update User Data
// @access  Private
router.put('/', auth, async (req, res) => {
    const { bloodRate, height, weight, eyeHealth, teethHeath, mentalHeath, smoke, alcohol } = req.body;
    const userInfo = {}
    if (bloodRate) userInfo.bloodRate = bloodRate;
    if (height) userInfo.height = height;
    if (weight) userInfo.weight = weight;
    if (eyeHealth) userInfo.eyeHealth = eyeHealth;
    if (teethHeath) userInfo.teethHeath = teethHeath;
    if (mentalHeath) userInfo.mentalHeath = mentalHeath;
    if (smoke) userInfo.smoke = smoke;
    if (alcohol) userInfo.alcohol = alcohol;

    const user = await User.findOneAndUpdate({
        _id: req.user.id
    }, userInfo, { new: true }).select("-password -Document")
    return res.json(user)
})

module.exports = router