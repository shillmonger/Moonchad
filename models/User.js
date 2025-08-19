// models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  twitterId: { type: String, required: true },
  username: { type: String, required: true }, // Display name
  handle:   { type: String, required: true }, // @handle
  profileImage: { type: String },
  dateJoined: { type: Date, default: Date.now },

  tokenWallet: { type: Number, default: 5000 }, // welcome bonus
  rewardWallet: { type: Number, default: 0 },

    // NEW: Wallet Address
  walletAddress: { type: String, default: null },

  // Referral tracking
  referrals: [{ type: String }],        // array of handles referred
  referralEarnings: { type: Number, default: 0 }, // total tokens earned via referrals

  // Simple admin gate (set manually in DB for your admin account)
  isAdmin: { type: Boolean, default: false }
});

// Virtual: usdWallet = tokenWallet × 0.04 (static conversion)
UserSchema.virtual('usdWallet').get(function () {
  const tokenValue = 0.001; // $0.001 per token
  return this.tokenWallet * tokenValue;
});


UserSchema.set('toJSON', { virtuals: true });
UserSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('User', UserSchema);
