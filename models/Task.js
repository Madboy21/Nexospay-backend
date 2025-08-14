import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  telegramId: { type: String, required: true },
  taskName: String,
  reward: { type: Number, default: 1 },
  date: { type: Date, default: Date.now }
});

export default mongoose.model("Task", taskSchema);

