const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Get user data
router.get("/:telegramId", async (req, res) => {
  try {
    const user = await User.findOne({ telegramId: req.params.telegramId });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update user progress
router.post("/update", async (req, res) => {
  const { telegramId, balance, completed } = req.body;
  try {
    const user = await User.findOneAndUpdate(
      { telegramId },
      { balance, completed },
      { new: true, upsert: true }
    );
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Referral reward
router.post("/referral", async (req, res) => {
  const { referrerId, reward } = req.body;
  try {
    const referrer = await User.findOne({ telegramId: referrerId });
    if (referrer) {
      referrer.balance += reward;
      await referrer.save();
      res.json({ message: "Referral reward added" });
    } else {
      res.status(404).json({ message: "Referrer not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

