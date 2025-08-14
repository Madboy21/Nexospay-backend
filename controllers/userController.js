import User from "../models/User.js";
import { TOKEN_PER_TASK, REFERRAL_BONUS, DAILY_TASK_LIMIT, MIN_WITHDRAW } from "../config/constants.js";
import { todayStamp } from "../utils/date.js";

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
    minWithdraw: MIN_WITHDRAW,
    tokenPerTask: TOKEN_PER_TASK,
    referralBonus: REFERRAL_BONUS
  };
}

export async function register(req,res){
  try{
    const { telegramId, username, firstName, lastName, referredBy } = req.body;
    if(!telegramId) return res.status(400).json({error:"telegramId required"});
    let user = await User.findOne({ telegramId });
    const isNew = !user;
    if(!user){
      user = await User.create({
        telegramId, username, firstName, lastName,
        tokens:0, completedTasks:0, referrals:0, referralBonusTokens:0,
        referredBy:null, dayStamp:todayStamp(), tasksToday:0, withdrawRequests:[]
      });
    }

    if(isNew && referredBy && referredBy !== telegramId){
      user.referredBy = referredBy;
      await user.save();
      const ref = await User.findOne({ telegramId: referredBy });
      if(ref){
        ref.tokens += REFERRAL_BONUS;
        ref.referralBonusTokens += REFERRAL_BONUS;
        ref.referrals +=1;
        await ref.save();
      }
    }

    return res.json(await toStats(user));
  }catch(e){ console.error(e); return res.status(500).json({error:"Server error"});}
}

export async function stats(req,res){
  try{
    const { telegramId } = req.body;
    if(!telegramId) return res.status(400).json({error:"telegramId required"});
    const user = await User.findOne({ telegramId });
    if(!user) return res.status(404).json({error:"User not found"});
    const today = todayStamp();
    if(user.dayStamp !== today){ user.dayStamp=today; user.tasksToday=0; await user.save();}
    return res.json(await toStats(user));
  }catch(e){ console.error(e); return res.status(500).json({error:"Server error"});}
}

