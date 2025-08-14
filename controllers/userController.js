import User from "../models/User.js";
import { TOKEN_PER_TASK, REFERRAL_BONUS, DAILY_TASK_LIMIT } from "../config/constants.js";
import { todayStamp } from "../utils/date.js";

async function toStats(user) {
  const today = todayStamp();
  const remainingToday = user.dayStamp === today ? Math.max(DAILY_TASK_LIMIT - user.tasksToday, 0) : DAILY_TASK_LIMIT;
  return {
    telegramId: user.telegramId,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    tokens: user.tokens,
    completedTasks: user.completedTasks,
    tasksToday: user.tasksToday,
    referrals: user.referrals,
    referralBonusTokens: user.referralBonusTokens,
    referredBy: user.referredBy,
    remainingToday,
  };
}

export async function register(req, res) {
  try {
    const { telegramId, username, firstName, lastName, referredBy } = req.body;
    if (!telegramId) return res.status(400).json({ error: "telegramId required" });

    let user = await User.findOne({ telegramId });
    const isNew = !user;
    if (!user) {
      user = await User.create({
        telegramId, username, firstName, lastName,
        tokens: 0, completedTasks: 0, tasksToday: 0, dayStamp: todayStamp(),
        referrals: 0, referralBonusTokens: 0, referredBy: null, withdrawRequests: []
      });
    }

    // Referral reward
    if (isNew && referredBy && referredBy !== telegramId) {
      user.referredBy = referredBy;
      await user.save();
      const ref = await User.findOne({ telegramId: referredBy });
      if (ref) {
        ref.tokens += REFERRAL_BONUS;
        ref.referralBonusTokens += REFERRAL_BONUS;
        ref.referrals += 1;
        await ref.save();
      }
    }

    return res.json(await toStats(user));
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Server error" });
  }
}

export async function stats(req, res) {
  try {
    const { telegramId } = req.body;
    if (!telegramId) return res.status(400).json({ error: "telegramId required" });

    const user = await User.findOne({ telegramId });
    if (!user) return res.status(404).json({ error: "User not found" });

    const today = todayStamp();
    if (user.dayStamp !== today) {
      user.dayStamp = today;
      user.tasksToday = 0;
      await user.save();
    }

    return res.json(await toStats(user));
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Server error" });
  }
}
