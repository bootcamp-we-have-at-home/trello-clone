import type { Request, Response } from "express";

import { createWorkspaceSchema } from "@trello-clone/schemas";

import { createWorkspace } from "../services/workspace.service.js";

export async function createWorkspaceController(
  req: Request,
  res: Response,
) {
  try {
    const validation = createWorkspaceSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: validation.error.issues,
      });
    }

    const { name } = validation.data;

    // Temporary ownerId.
    // This will come from the authenticated user after
    // connecting the authentication middleware.
    const ownerId = 1;

    const workspace = await createWorkspace({
      name,
      ownerId,
    });

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
}