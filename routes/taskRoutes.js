import { Router } from "express";
import { completeTask } from "../controllers/taskController.js";
const router = Router();
router.post("/complete-task", completeTask);
export default router;
