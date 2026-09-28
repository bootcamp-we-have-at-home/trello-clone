import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { createBoardController,getWorkspaceBoardsController,getBoardController } from "../controllers/board.controller.js";

const router: Router = Router();

router.post("/", authMiddleware, createBoardController);
router.get("/", authMiddleware, getWorkspaceBoardsController);
router.get("/:id", authMiddleware, getBoardController);
export default router;