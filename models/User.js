const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  telegramId: { type: String, required: true, unique: true },
  firstName: String,
  balance: { type: Number, default: 0 },
  completed: { type: Number, default: 0 },
  referrerId: { type: String, default: null },
});

module.exports = mongoose.model("User", UserSchema);

