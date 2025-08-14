import User from "../models/User.js";
import Task from "../models/Task.js";
import { TOKEN_PER_TASK, REFERRAL_BONUS, DAILY_TASK_LIMIT } from "../config/constants.js";
import { todayStamp } from "../utils/date.js";

export async function completeTask(req,res){
  try{
    const { telegramId, taskName } = req.body;
    if(!telegramId) return res.status(400).json({error:"telegramId required"});
    const user = await User.findOne({ telegramId });
    if(!user) return res.status(404).json({error:"User not found"});

    const today = todayStamp();
    if(user.dayStamp !== today){ user.dayStamp=today; user.tasksToday=0; }

    if(user.tasksToday >= DAILY_TASK_LIMIT) return res.status(400).json({error:"Daily limit reached"});

    // Update user tokens
    user.tasksToday +=1;
    user.completedTasks +=1;
    user.tokens += TOKEN_PER_TASK;
    await user.save();

    // Save task history
    await Task.create({ telegramId, taskName, reward:TOKEN_PER_TASK });

    // Give referral bonus
    if(user.referredBy){
      const ref = await User.findOne({ telegramId:user.referredBy });
      if(ref){
        const bonus = Math.floor(TOKEN_PER_TASK * 0.1); // 10%
        ref.tokens += bonus;
        ref.referralBonusTokens += bonus;
        await ref.save();
      }
    }

    return res.json({ success:true, user });
  }catch(e){ console.error(e); return res.status(500).json({error:"Server error"});}
}

