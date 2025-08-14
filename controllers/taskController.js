import User from "../models/User.js";
import { TOKEN_PER_TASK, REFERRAL_BONUS, DAILY_TASK_LIMIT } from "../config/constants.js";
import { todayStamp } from "./userController.js";

async function toStats(user){
  const today = todayStamp();
  const remainingToday = user.dayStamp === today ? Math.max(DAILY_TASK_LIMIT - user.tasksToday,0) : DAILY_TASK_LIMIT;
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
    tokenPerTask: TOKEN_PER_TASK,
    referralBonus: REFERRAL_BONUS
  };
}

export async function completeTask(req,res){
  try{
    const { telegramId, referrerId } = req.body;
    const user = await User.findOne({ telegramId });
    if(!user) return res.status(404).json({error:"User not found"});

    const today = todayStamp();
    if(user.dayStamp !== today){ user.dayStamp = today; user.tasksToday=0; await user.save();}
    if(user.tasksToday >= DAILY_TASK_LIMIT) return res.status(400).json({error:"Daily limit reached"});

    user.tasksToday +=1;
    user.completedTasks +=1;
    user.tokens += TOKEN_PER_TASK;

    // Referral bonus
    if(referrerId && referrerId !== telegramId){
      const ref = await User.findOne({ telegramId: referrerId });
      if(ref){
        const bonus = Math.floor(TOKEN_PER_TASK * 0.1); // 10%
        ref.tokens += bonus;
        ref.referralBonusTokens += bonus;
        await ref.save();
      }
    }

    await user.save();
    return res.json(await toStats(user));
  }catch(e){ console.error(e); return res.status(500).json({error:"Server error"});}
}
