// routes/wallet.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Middleware: must be logged in
function ensureAuth(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ error: 'Not logged in' });
}

// Save wallet address
router.post('/submit', ensureAuth, async (req, res) => {
  try {
const walletAddress = req.body?.walletAddress;

    if (!walletAddress || walletAddress.length < 20) {
      return res.status(400).json({ error: 'Invalid wallet address' });
    }

    // Attach wallet to logged-in user
    const user = await User.findById(req.user.id);
    user.walletAddress = walletAddress;
    await user.save();

    res.json({ success: true, walletAddress: user.walletAddress });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});


// Get current user's wallet
router.get('/me', ensureAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("walletAddress");
    res.json({ walletAddress: user.walletAddress });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});



module.exports = router;
