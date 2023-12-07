const express = require('express');
const jwt = require('jsonwebtoken');
const userRoutes = express.Router();

let User = require('../models/user');

// POST /api/users/register
userRoutes.route('/register').post(async function(req, res) {
    let user = new User(req.body);

    try {
        await user.save();
        return res.status(201).json('User registered successfully.');
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).send('A user with that username already exists.');
        } else {
            return res.status(500).send('Error registering new user.');
        }
    }
});

// POST /api/users/login
userRoutes.route('/login').post(async function(req, res) {
    try {
        let user = await User.findOne({ username: req.body.username });

        if (!user) {
            res.status(401).json({ message: 'Authentication failed. User not found.' });
        } else {
            user.comparePassword(req.body.password, function(err, isMatch) {
                if (isMatch && !err) {
                    let token = jwt.sign(user.toJSON(), process.env.SECRET_KEY, {
                        expiresIn: 604800 // 1 week
                    });

                    res.json({ token: 'JWT ' + token });
                } else {
                    res.status(401).json({ message: 'Authentication failed. Wrong password.' });
                }
            });
        }
    } catch (err) {
        throw err;
    }
});


module.exports = userRoutes;
