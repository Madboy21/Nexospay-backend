import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  telegramId: { type: String, required: true, unique: true },
  username: String,
  firstName: String,
  lastName: String,
  tokens: { type: Number, default: 0 },
  completedTasks: { type: Number, default: 0 },
  referrals: { type: Number, default: 0 },
  referralBonusTokens: { type: Number, default: 0 },
  referredBy: { type: String, default: null },
  dayStamp: { type: String, default: null },
  tasksToday: { type: Number, default: 0 },
  withdrawRequests: [
    {
      amount: Number,
      date: { type: Date, default: Date.now },
      status: { type: String, enum: ["pending","approved","rejected"], default: "pending" }
    }
  ]
}, { timestamps: true });

export default mongoose.model("User", userSchema);


