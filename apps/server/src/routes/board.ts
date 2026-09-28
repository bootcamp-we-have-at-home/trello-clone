import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { createBoardController } from "../controllers/board.controller.js";

const router: Router = Router();

router.post("/", authMiddleware, createBoardController);

export default router;