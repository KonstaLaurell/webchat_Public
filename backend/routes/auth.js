const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Ban = require("../models/Ban")
const router = express.Router();
const dc = require("../log/Discordwebhooks")
require('dotenv').config();
//rekisteröityminen
router.post('/register', async (req, res) => {
  const ip = req.headers['x-forwarded-for'] || false;
  try {
    const { username, password } = req.body;
    dc.sendDCLOG(`user: ${username} registered in. \n ip: ${ip}`);
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }
    const ipban = await Ban.findOne({ ip })
    const userban = await Ban.findOne({username})
    if (ipban) {
      return res.status(400).json({ error: 'You are banned' })
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      password: hashedPassword,
      ip: ip,
    });
    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// kirjautuminen
router.post('/login', async (req, res) => {
  const ip = req.headers['x-forwarded-for'] || false;
  try {
    const { username, password} = req.body;
    dc.sendDCLOG(`user: ${username} logged in. \n ip: ${ip}`);

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
    const ipban = await Ban.findOne({ ip })
    if (ipban) {
      return res.status(400).json({ error: 'You are banned' })
    }
    const ban = await Ban.findOne({ username })
    if (ipban) {
      return res.status(400).json({ error: 'You are banned' })
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      dc.sendDCLOG("Failed")
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Update the user's IP
    await User.findOneAndUpdate({ username }, { $set: { ip } });

    const token = jwt.sign({ userId: user._id, username: user.username }, process.env.SKEY, {
      expiresIn: '1h',
    });
    dc.sendDCLOG("Succesful")
    res.json({ token }); // Send only token
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
