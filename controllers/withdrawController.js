const Withdraw = require('../models/Withdraw');
const User = require('../models/User');

const requestWithdraw = async (req, res) => {
  try {
    const { telegramId, wallet } = req.body;

    if (!telegramId || !wallet) {
      return res.status(400).json({ message: 'telegramId and wallet are required' });
    }

    const user = await User.findOne({ telegramId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.balance < 100) {
      return res.status(400).json({ message: 'Minimum balance of 100 not met' });
    }

    // Create new withdraw request with the current balance amount
    const withdraw = new Withdraw({ telegramId, wallet, amount: user.balance });
    await withdraw.save();

    // Reset user balance to 0 after withdrawal request
    user.balance = 0;
    await user.save();

    res.status(201).json({ message: 'Withdraw requested successfully' });

  } catch (error) {
    console.error('Withdraw request error:', error);
    res.status(500).json({ message: 'Server error during withdraw request' });
  }
};

module.exports = { requestWithdraw };
