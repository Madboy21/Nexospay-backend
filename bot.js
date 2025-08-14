import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import withdrawRoutes from "./routes/withdrawRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/withdraws", withdrawRoutes);

const PORT = process.env.PORT || 5000;
connectDB(process.env.MONGO_URI).then(()=>{
  app.listen(PORT,()=>console.log(`🚀 Backend running on http://localhost:${PORT}`));
});
