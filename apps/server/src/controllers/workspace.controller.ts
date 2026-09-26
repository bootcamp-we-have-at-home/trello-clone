import type { Request, Response } from "express";
import { createWorkspaceSchema } from "../validation/workspace.js";
import {
  createWorkspace,
  getUserWorkspaces,
  deleteWorkspace,
} from "../services/workspace.service.js";

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
export const getUserWorkspacesController = async (
  req: Request,
  res: Response,
) => {
  if (!req.user) {
    return res.status(401).json({
      message: "Authentication required",
    });
  }

  try {
    const workspaces = await getUserWorkspaces(req.user.id);

    return res.status(200).json({
      workspaces,
    });
  } catch (error) {
    console.error("Get workspaces error:", error);

    return res.status(500).json({
      message: "Failed to fetch workspaces",
    });
  }
};
export const deleteWorkspaceController = async (
  req: Request,
  res: Response,
) => {
  if (!req.user) {
    return res.status(401).json({
      message: "Authentication required",
    });
  }

  const workspaceId = Number(req.params.id);

  if (!Number.isInteger(workspaceId) || workspaceId <= 0) {
    return res.status(400).json({
      message: "Invalid workspace ID",
    });
  }

  try {
    const workspace = await deleteWorkspace(
      workspaceId,
      req.user.id,
    );

    if (!workspace) {
      return res.status(404).json({
        message:
          "Workspace not found or you are not the owner",
      });
    }

    return res.status(200).json({
      message: "Workspace deleted successfully",
      workspace,
    });
  } catch (error) {
    console.error("Delete workspace error:", error);

    return res.status(500).json({
      message: "Failed to delete workspace",
    });
  }
};