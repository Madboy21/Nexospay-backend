import User from "../models/User.js";
import { TOKEN_PER_TASK, REFERRAL_BONUS, DAILY_TASK_LIMIT, MIN_WITHDRAW } from "../config/constants.js";
import { todayStamp } from "../utils/date.js";

// Helper: return structured user stats
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
    referrals: user.referrals,
    referralBonusTokens: user.referralBonusTokens,
    referredBy: user.referredBy,
    dayStamp: user.dayStamp,
    tasksToday: user.tasksToday,
    dailyLimit: DAILY_TASK_LIMIT,
    remainingToday,
    minWithdraw: MIN_WITHDRAW,
    tokenPerTask: TOKEN_PER_TASK,
    referralBonus: REFERRAL_BONUS
  };
}

// Register or return existing user
export async function register(req, res) {
  try {
    const { telegramId, username, firstName, lastName, referredBy } = req.body;
    if (!telegramId) return res.status(400).json({ error: "telegramId required" });

    let user = await User.findOne({ telegramId });
    const isNew = !user;

    if (!user) {
      user = await User.create({
        telegramId,
        username,
        firstName,
        lastName,
        tokens: 0,
        completedTasks: 0,
        referrals: 0,
        referralBonusTokens: 0,
        referredBy: null,
        dayStamp: todayStamp(),
        tasksToday: 0,
        withdrawRequests: []
      });
    }

    // Handle referral bonus for new user
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

// Fetch user stats
export async function stats(req, res) {
  try {
    const { telegramId } = req.body;
    if (!telegramId) return res.status(400).json({ error: "telegramId required" });

    const user = await User.findOne({ telegramId });
    if (!user) return res.status(404).json({ error: "User not found" });

    // Daily reset
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

// Complete a task / watch ad
export async function completeTask(req, res) {
  try {
    const { telegramId, referrerId } = req.body;
    if (!telegramId) return res.status(400).json({ error: "telegramId required" });

    const user = await User.findOne({ telegramId });
    if (!user) return res.status(404).json({ error: "User not found" });

    const today = todayStamp();

    // Daily reset
    if (user.dayStamp !== today) {
      user.dayStamp = today;
      user.tasksToday = 0;
    }

    // Daily limit check
    if (user.tasksToday >= DAILY_TASK_LIMIT)
      return res.status(400).json({ error: "Daily limit reached" });

    // Increment task & tokens
    user.tasksToday += 1;
    user.tokens += TOKEN_PER_TASK;
    user.completedTasks += 1;

    // Referral reward
    if (referrerId && referrerId !== telegramId) {
      const ref = await User.findOne({ telegramId: referrerId });
      if (ref) {
        ref.tokens += REFERRAL_BONUS;
        ref.referralBonusTokens += REFERRAL_BONUS;
        ref.referrals += 1;
        await ref.save();
      }
    }

    await user.save();

    // Return updated stats for live frontend update
    return res.json(await toStats(user));
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Server error" });
  }
}
