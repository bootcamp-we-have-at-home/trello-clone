import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  createWorkspaceController,
  getUserWorkspacesController,
} from "../controllers/workspace.controller.js";
const router: Router = Router();

router.post(
  "/",
  authMiddleware,
  createWorkspaceController,
);
router.get(
  "/",
  authMiddleware,
  getUserWorkspacesController,
);
export default router;