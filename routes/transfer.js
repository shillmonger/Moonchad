// routes/wallet.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Transfer = require('../models/Transfer');

function ensureAuth(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) return next();
  return res.status(401).json({ success: false, message: 'Not authenticated' });
}

// 🔍 Lookup user by handle
router.get('/find-user/:handle', ensureAuth, async (req, res) => {
  try {
    const user = await User.findOne({ handle: req.params.handle }).lean();
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    return res.json({
      success: true,
      user: {
        username: user.username,
        handle: user.handle,
        profileImage: user.profileImage,
        tokenWallet: user.tokenWallet
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// 🔄 Transfer tokens
router.post('/transfer', ensureAuth, async (req, res) => {
  try {
    const { handle, amount } = req.body;
    const sender = await User.findById(req.user._id);
    const recipient = await User.findOne({ handle });

    if (!recipient) {
      return res.status(404).json({ success: false, message: 'Recipient not found' });
    }

    if (sender.handle === recipient.handle) {
      return res.status(400).json({ success: false, message: "You can't send tokens to yourself" });
    }

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid amount' });
    }

    if (sender.tokenWallet < amount) {
      return res.status(400).json({ success: false, message: 'Insufficient balance' });
    }

    // Deduct from sender
    sender.tokenWallet -= amount;
    await sender.save();

    // Credit recipient
    recipient.tokenWallet += amount;
    await recipient.save();

    // Save transfer record
    await Transfer.create({
      from: sender._id,
      to: recipient._id,
      amount
    });

    return res.json({ success: true, message: `Sent ${amount} tokens to @${recipient.handle}` });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
