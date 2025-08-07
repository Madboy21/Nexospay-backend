const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  telegramId: { type: String, required: true },
  date: { type: String, required: true },
  completed: { type: Number, default: 0 },
});

module.exports = mongoose.model('Task', taskSchema);
