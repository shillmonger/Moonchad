// routes/tweets.js
const express = require('express');
const router = express.Router();
const Tweet = require('../models/Tweet');

// auth gate (duplicated simple version)
function ensureAuth(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) return next();
  return res.redirect('/');
}

// Basic URL validator for X/Twitter status links
const TWEET_URL_REGEX = /^(https?:\/\/)?(x\.com|twitter\.com)\/[A-Za-z0-9_]+\/status\/\d+/i;

// POST /tweets/submit
router.post('/submit', ensureAuth, async (req, res) => {
  try {
    const tweetLink = (req.body['tweet-link'] || '').trim();

    if (!TWEET_URL_REGEX.test(tweetLink)) {
      // Invalid link
      return res.redirect('/dashboard?msg=Invalid+tweet+link&type=error');
    }

    await Tweet.create({
      user: req.user._id,
      userHandle: req.user.handle, // snapshot for admin view
      tweetLink,
      status: 'pending'
    });

    return res.redirect('/dashboard?msg=Tweet+submitted+successfully&type=success');
  } catch (err) {
    // Duplicate link (unique index) → already submitted
    if (err && err.code === 11000) {
      return res.redirect('/dashboard?msg=Tweet+already+submitted&type=error');
    }
    console.error(err);
    return res.redirect('/dashboard?msg=Server+error&type=error');
  }
});

module.exports = router;
