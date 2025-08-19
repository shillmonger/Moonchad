// routes/admin.js
const express = require('express');
const router = express.Router();
const Tweet = require('../models/Tweet');
const User = require('../models/User');
const Claim = require('../models/Claim');


function ensureAuth(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) return next();
  return res.redirect('/');
}

function ensureAdmin(req, res, next) {
  if (req.user && req.user.isAdmin) return next();
  return res.status(403).send('Forbidden');
}

// Reward rules based on LIKES (you can change to views if needed)
function calcRewardFromLikes(likes) {
  const tokensPerLike = 100; // 1 like = 100 tokens (=$0.10)
  return likes * tokensPerLike;
}

// GET /admin/tweets → list pending
router.get('/tweets', ensureAuth, ensureAdmin, async (req, res) => {
  const pending = await Tweet.find({ status: 'pending' })
    .populate('user', 'username')   // if you want username
    .sort({ createdAt: -1 })        // use createdAt, not dateSubmitted
    .lean();

  // pass query params to template for Toastify
  const { msg, type } = req.query;

  res.render('admin', { tweets: pending, msg, type });  
});

// POST /admin/tweets/:id/approve
router.post('/tweets/:id/approve', ensureAuth, ensureAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const likes = parseInt(req.body.likes, 10) || 0;

    const tweet = await Tweet.findById(id);
    if (!tweet) return res.redirect('/admin/tweets?msg=Tweet+not+found&type=error');
    if (tweet.status === 'approved') return res.redirect('/admin/tweets?msg=Already+approved&type=error');

    // find the owner
    const user = await User.findById(tweet.user);
    if (!user) return res.redirect('/admin/tweets?msg=User+not+found&type=error');

    // calc reward
    const reward = calcRewardFromLikes(likes);

    // credit reward to BOTH rewardWallet AND tokenWallet
    user.rewardWallet += reward;
    user.tokenWallet  += reward;
    await user.save();

    // finalize tweet record
    tweet.likes = likes;
    tweet.rewardGiven = reward;
    tweet.status = 'approved';
    await tweet.save();

    // redirect with Toastify success
    return res.redirect(`/admin/tweets?msg=Tweet+approved+(${reward}+tokens)&type=success`);
  } catch (err) {
    console.error(err);
    return res.redirect('/admin/tweets?msg=Server+error&type=error');
  }
});

// Optional: reject route
router.post('/tweets/:id/reject', ensureAuth, ensureAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const tweet = await Tweet.findById(id);
    if (!tweet) return res.redirect('/admin/tweets?msg=Tweet+not+found&type=error');
    tweet.status = 'rejected';
    await tweet.save();

    return res.redirect('/admin/tweets?msg=Tweet+rejected&type=success');
  } catch (err) {
    console.error(err);
    return res.redirect('/admin/tweets?msg=Server+error&type=error');
  }
});



// GET /admin/claims
router.get('/claims', ensureAuth, ensureAdmin, async (req, res) => {
  const claims = await Claim.find().populate('user', 'username handle').sort({ createdAt: -1 }).lean();
  res.render('admin-claims', { claims });
});




module.exports = router;
