import type { Request, Response } from "express";
import { createWorkspaceSchema } from "../validation/workspace.js";
import { createWorkspace } from "../services/workspace.service.js";

export const createWorkspaceController = async (
  req: Request,
  res: Response,
) => {
  const result = createWorkspaceSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: result.error.flatten().fieldErrors,
    });
  }

  if (!req.user) {
    return res.status(401).json({
      message: "Authentication required",
    });
  }

  try {
    const workspace = await createWorkspace(req.user.id, result.data);

    return res.status(201).json({
      message: "Workspace created successfully",
      workspace,
    });
  } catch (error) {
    console.error("Create workspace error:", error);

    return res.status(500).json({
      message: "Failed to create workspace",
    });
  }
};