const Task = require('../models/Task');
const User = require('../models/User');

const getDateKey = () => new Date().toISOString().split('T')[0];

const completeTask = async (req, res) => {
  const { telegramId } = req.body;
  const date = getDateKey();

  let task = await Task.findOne({ telegramId, date });
  if (!task) {
    task = new Task({ telegramId, date, completed: 0 });
  }

  if (task.completed >= 20) {
    return res.status(400).json({ message: 'Daily limit reached' });
  }

  task.completed += 1;
  await task.save();

  await User.updateOne({ telegramId }, { $inc: { balance: 1 } });

  res.json({ completed: task.completed });
};

const getProgress = async (req, res) => {
  const { telegramId } = req.params;
  const date = getDateKey();
  const task = await Task.findOne({ telegramId, date });
  res.json({ completed: task?.completed || 0 });
};

module.exports = { completeTask, getProgress };
