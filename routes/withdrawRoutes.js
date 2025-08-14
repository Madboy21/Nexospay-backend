import { Router } from "express";
import { requestWithdraw } from "../controllers/withdrawController.js";
const router = Router();
router.post("/withdraw", requestWithdraw);
export default router;
