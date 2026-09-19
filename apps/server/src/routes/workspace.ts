import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  createWorkspaceController,
  getUserWorkspacesController,
  deleteWorkspaceController,
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
router.delete(
  "/:id",
  authMiddleware,
  deleteWorkspaceController,
);
export default router;