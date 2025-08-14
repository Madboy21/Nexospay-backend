import { Router } from "express";
import { register, stats } from "../controllers/userController.js";
const router = Router();
router.post("/register", register);
router.post("/stats", stats);
export default router;
