const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('../models/User');

// --- Signup route that forwards referral via query param ---
router.get('/signup', (req, res) => {
  const { ref } = req.query; // capture referral from query
  const redirectUrl = ref ? `/auth/twitter?ref=${ref}` : '/auth/twitter';
  res.redirect(redirectUrl); // forward referral to Twitter OAuth
});

// Start Twitter auth
router.get('/twitter', (req, res, next) => {
  // Pass referral as query param if present
  const ref = req.query.ref;
  passport.authenticate('twitter', {
    callbackURL: ref ? `${process.env.TWITTER_CALLBACK_URL}?ref=${ref}` : process.env.TWITTER_CALLBACK_URL
  })(req, res, next);
});

// Callback after Twitter login
router.get(
  '/twitter/callback',
  passport.authenticate('twitter', { failureRedirect: '/' }),
  async (req, res) => {
    try {
      const user = req.user;                // logged-in user
      const refHandle = req.query.ref;      // get referral from query param

      // console.log("Referral handle from query:", refHandle);
      // console.log("New user handle:", user.handle);

      // Avoid self-referral and duplicates
      if (refHandle && refHandle !== user.handle) {
        const referrer = await User.findOne({ handle: refHandle });
        if (referrer) {
          if (!referrer.referrals.includes(user.handle)) {
            referrer.referrals.push(user.handle);   // track new referral
            referrer.tokenWallet += 2000;          // reward tokens
            referrer.referralEarnings += 2000;     // track referral earnings
            await referrer.save();
            // console.log("Referrer wallet updated!", referrer.tokenWallet, referrer.referralEarnings);
          } else {
            // console.log("User already referred by this referrer");
          }
        } else {
          // console.log("Referrer not found in DB");
        }
      } else {
        // console.log("No valid referral or self-referral");
      }

      res.redirect('/dashboard');
    } catch (err) {
      console.error(err);
      res.redirect('/dashboard');
    }
  }
);

// Logout
router.get('/logout', (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    res.redirect('/');
  });
});

module.exports = router;
