// models/Tweet.js
const mongoose = require('mongoose');

const TweetSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  // Store a snapshot so admin can see who submitted without extra lookups
  userHandle: { type: String, required: true },

  tweetLink: { type: String, required: true, unique: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },

  likes: { type: Number, default: 0 },
  rewardGiven: { type: Number, default: 0 } // tokens credited for this tweet
}, { timestamps: true }); // <-- adds createdAt + updatedAt automatically

// Optional: quick index for admin sorting
TweetSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('Tweet', TweetSchema);
