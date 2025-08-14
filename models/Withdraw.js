import mongoose from "mongoose";

const withdrawSchema = new mongoose.Schema({
  telegramId: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ["pending","approved","rejected"], default: "pending" },
  date: { type: Date, default: Date.now }
});

export default mongoose.model("Withdraw", withdrawSchema);

