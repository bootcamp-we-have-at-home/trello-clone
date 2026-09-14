import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { createWorkspaceController } from "../controllers/workspace.controller.js";

const router: Router = Router();

router.post(
  "/",
  authMiddleware,
  createWorkspaceController,
);

export default router;