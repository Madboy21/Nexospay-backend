const User = require('../models/User');

const registerUser = async (req, res) => {
  const { telegramId, username, referrer } = req.body;

  let user = await User.findOne({ telegramId });
  if (user) return res.json(user);

  user = new User({ telegramId, username, referrer });

  if (referrer) {
    const refUser = await User.findOne({ telegramId: referrer });
    if (refUser) {
      refUser.referredUsers += 1;
      refUser.balance += 8; // 8% equivalent reward
      await refUser.save();
    }
  }

  await user.save();
  res.status(201).json(user);
};

module.exports = { registerUser };
