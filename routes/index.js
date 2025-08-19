const express = require('express');
const router = express.Router();
const User = require("../models/User"); // adjust path if needed


function ensureAuth(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/');
}


// landing page 
// routes/index.js
router.get("/", async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 }).limit(4); 
    res.render("index", { users });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});



// Roadmap page 
router.get('/roadmap', (req, res) => {
  res.render('roadmap', { title: 'Leaderboard', user: req.user });
});


// How it works page 
router.get('/how-it-works', (req, res) => {
  res.render('how-it-works', { title: 'MOONCHAD — Airdrop', user: req.user });
});



// Dashboard page
router.get("/dashboard", async (req, res) => {
  try {
    const user = req.user; // Passport gives logged-in user
    if (!user) return res.redirect("/"); // safety check

    // Compute usdWallet for logged-in user
    user.usdWallet = user.tokenWallet * 0.001;

    // Fetch top 50 users sorted by tokenWallet descending
    const users = await User.find({})
      .sort({ tokenWallet: -1 })
      .limit(50)
      .lean();

    // Compute usdWallet for each user in leaderboard
    users.forEach(u => {
      u.usdWallet = u.tokenWallet * 0.001;
    });

    res.render("dashboard", { user, users });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading dashboard");
  }
});


// profile page
router.get('/profile', ensureAuth, async (req, res) => {
  try {
    const user = req.user;

    // Example: progress as a percentage of some target, e.g., 50 tokens = 100%
    const targetTokens = 50; 
    const rewardProgress = Math.min(Math.round((user.rewardWallet / targetTokens) * 100), 100);

    res.render('profile', { user, rewardProgress });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading profile");
  }
});

module.exports = router;
