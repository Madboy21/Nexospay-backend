import User from "../models/User.js";
import { TOKEN_PER_TASK, DAILY_TASK_LIMIT } from "../config/constants.js";
import { todayStamp } from "../utils/date.js";

export async function completeTask(req, res) {
  const { telegramId } = req.body;
  if (!telegramId) return res.status(400).json({ error: "telegramId required" });

  try {
    const user = await User.findOne({ telegramId });
    if (!user) return res.status(404).json({ error: "User not found" });

    const today = todayStamp();
    if (user.dayStamp !== today) {
      user.dayStamp = today;
      user.tasksToday = 0;
    }

    if (user.tasksToday >= DAILY_TASK_LIMIT)
      return res.status(400).json({ error: "Daily limit reached" });

    user.tasksToday += 1;
    user.completedTasks += 1;
    user.tokens += TOKEN_PER_TASK;

    await user.save();
    res.json({ tokens: user.tokens, completedTasks: user.completedTasks, tasksToday: user.tasksToday });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}
