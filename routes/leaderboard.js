const express = require("express");
const router = express.Router();
const User = require("../models/User"); // adjust path if needed

// Leaderboard route
router.get("/", async (req, res) => {
  try {
    const users = await User.find({}).lean();

    // Safely calculate USD wallet for each user
    users.forEach(u => {
      const token = u.tokenWallet || 0;
      const reward = u.rewardWallet || 0;
      u.usdWallet = (token + reward) * 0.001; // 👈 conversion rate
    });

    // Sort by tokenWallet (highest first) so leaderboard rank is correct
    const sortedUsers = users.sort((a, b) => (b.tokenWallet || 0) - (a.tokenWallet || 0));

    // Pass both users list & current logged-in user to EJS
    res.render("leaderboard", { users: sortedUsers, user: req.user || null });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading leaderboard");
  }
});

module.exports = router;
