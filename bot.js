require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const mongoose = require("mongoose");
const User = require("./models/User");
const connectDB = require("./config/db");

connectDB();

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

bot.onText(/\/start(?:\s+(.*))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const username = msg.chat.username;
  const firstName = msg.chat.first_name;
  const lastName = msg.chat.last_name;
  const referredBy = match[1] || null;

  let user = await User.findOne({ telegramId: chatId.toString() });

  if (!user) {
    user = await User.create({
      telegramId: chatId.toString(),
      username,
      firstName,
      lastName,
      referredBy
    });
  }

  bot.sendMessage(chatId, `Welcome ${firstName}! Your account has been created.`);
});
