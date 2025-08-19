// routes/claim.js
const express = require('express');
const router = express.Router();
const Claim = require('../models/Claim');
const User = require('../models/User');

// Auth middleware
function ensureAuth(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) return next();
  return res.status(401).json({ success: false, message: 'Not authenticated' });
}

// POST /claim
router.post('/', ensureAuth, async (req, res) => {
  try {
    const { amount } = req.body;
    const user = await User.findById(req.user._id);

    if (!amount || amount < 50000) {
      return res.status(400).json({ success: false, message: 'Minimum claim is 50k tokens' });
    }

    if (!user.walletAddress) {
      return res.status(400).json({ success: false, message: "You haven't connected your wallet" });
    }

    if (user.tokenWallet < amount) {
      return res.status(400).json({ success: false, message: "You don't have up to 50k of our token" });
    }

    if (user.referrals.length < 5) {
      return res.status(400).json({ success: false, message: "You don't have 5 referrals yet" });
    }

    // Deduct tokens immediately
    user.tokenWallet -= amount;
    await user.save();

    // Create claim record
    const claim = await Claim.create({
      user: user._id,
      handle: user.handle,
      walletAddress: user.walletAddress,
      amount
    });

    return res.json({ success: true, message: 'Submitted successfully', claim });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
