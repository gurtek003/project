const express = require('express');
const jwt = require('jsonwebtoken');
const userRoutes = express.Router();

let User = require('../models/user');

// Render the user registration form
userRoutes.get('/', function(req, res) {
  res.render('register');
});

// POST /api/users/register
userRoutes.route('/').post(async function(req, res) {
  let user = new User(req.body);

  try {
    await user.save();
    res.redirect('/login'); // Redirect to login after successful registration
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).send('A user with that username already exists.');
    } else {
      return res.status(500).send('Error registering new user.');
    }
  }
});

// Render the user login form
userRoutes.get('/login', function(req, res) {
  res.render('login');
});

// Process user login
userRoutes.post('/login', async function(req, res) {
    try {
        const user = await User.findOne({ username: req.body.username });

        if (!user) {
            return res.status(401).json({ message: 'Authentication failed. User not found.' });
        }

        user.comparePassword(req.body.password, function(err, isMatch, token) { // Update here
            if (isMatch && !err) {
                res.cookie('token', token, { httpOnly: true }); // Set token in cookies
                res.redirect('/api/restaurants'); // Redirect on successful login
            } else {
                return res.status(401).json({ message: 'Authentication failed. Wrong password.' });
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Logout route
userRoutes.get('/logout', function(req, res) {
  res.clearCookie('token'); // Clear token from cookies
  res.redirect('/login');
});

module.exports = userRoutes;
