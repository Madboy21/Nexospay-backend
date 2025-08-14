import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  telegramId: { type: String, required: true, unique: true },
  username: String,
  firstName: String,
  lastName: String,
  tokens: { type: Number, default: 0 },
  completedTasks: { type: Number, default: 0 },
  tasksToday: { type: Number, default: 0 },
  dayStamp: String,
  referrals: { type: Number, default: 0 },
  referralBonusTokens: { type: Number, default: 0 },
  referredBy: String,
  withdrawRequests: Array
});

export default mongoose.model("User", userSchema);
