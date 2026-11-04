import { Router } from "express";

import { getBoardCardsController } from "../controllers/card.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router: Router = Router();

router.get("/:boardId/cards", authMiddleware, getBoardCardsController);

export default router;
