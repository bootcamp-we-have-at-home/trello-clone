import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { createBoardController,getWorkspaceBoardsController,getBoardController,updateBoardController } from "../controllers/board.controller.js";

const router: Router = Router();

router.post("/", authMiddleware, createBoardController);
router.get("/", authMiddleware, getWorkspaceBoardsController);
router.get("/:id", authMiddleware, getBoardController);
router.put("/:id", authMiddleware, updateBoardController);
export default router;