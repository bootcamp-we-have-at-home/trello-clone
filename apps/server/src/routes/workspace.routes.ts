import { Router } from "express";

import { createWorkspaceController } from "../controllers/workspace.controller.js";

const router: ReturnType<typeof Router> = Router();

router.post("/", createWorkspaceController);

export default router;