const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  telegramId: { type: String, required: true, unique: true },
  username: String,
  referrer: String,
  balance: { type: Number, default: 0 },
  referredUsers: { type: Number, default: 0 },
});

module.exports = mongoose.model('User', userSchema);
