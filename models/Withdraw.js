const mongoose = require('mongoose');

const withdrawSchema = new mongoose.Schema({
  telegramId: String,
  wallet: String,
  amount: Number,
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Withdraw', withdrawSchema);
