import type { Request, Response } from "express";

import {
  createBoardSchema,
  updateBoardSchema,
} from "../validation/board.js";

import {
  createBoard,
  getWorkspaceBoards,
  getBoard,
  updateBoard,
  deleteBoard,
} from "../services/board.service.js";

export const createBoardController = async (
  req: Request,
  res: Response,
) => {
  const result = createBoardSchema.safeParse(req.body);

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
    const board = await createBoard(
      req.user.id,
      result.data,
    );

    if (!board) {
      return res.status(403).json({
        message:
          "You are not a member of this workspace",
      });
    }

    return res.status(201).json({
      message: "Board created successfully",
      board,
    });
  } catch (error) {
    console.error("Create board error:", error);

    return res.status(500).json({
      message: "Failed to create board",
    });
  }
};

export const getWorkspaceBoardsController = async (
  req: Request,
  res: Response,
) => {
  if (!req.user) {
    return res.status(401).json({
      message: "Authentication required",
    });
  }

  const workspaceId = Number(req.query.workspaceId);

  if (
    !Number.isInteger(workspaceId) ||
    workspaceId <= 0
  ) {
    return res.status(400).json({
      message: "Invalid workspace ID",
    });
  }

  try {
    const boards = await getWorkspaceBoards(
      req.user.id,
      workspaceId,
    );

    if (!boards) {
      return res.status(403).json({
        message:
          "You are not a member of this workspace",
      });
    }

    return res.status(200).json({
      boards,
    });
  } catch (error) {
    console.error(
      "Get workspace boards error:",
      error,
    );

    return res.status(500).json({
      message: "Failed to fetch workspace boards",
    });
  }
};

export const getBoardController = async (
  req: Request,
  res: Response,
) => {
  if (!req.user) {
    return res.status(401).json({
      message: "Authentication required",
    });
  }

  const boardId = Number(req.params.id);

  if (
    !Number.isInteger(boardId) ||
    boardId <= 0
  ) {
    return res.status(400).json({
      message: "Invalid board ID",
    });
  }

  try {
    const board = await getBoard(
      req.user.id,
      boardId,
    );

    if (!board) {
      return res.status(404).json({
        message: "Board not found",
      });
    }

    return res.status(200).json({
      board,
    });
  } catch (error) {
    console.error("Get board error:", error);

    return res.status(500).json({
      message: "Failed to fetch board",
    });
  }
};

export const updateBoardController = async (
  req: Request,
  res: Response,
) => {
  if (!req.user) {
    return res.status(401).json({
      message: "Authentication required",
    });
  }

  const boardId = Number(req.params.id);

  if (
    !Number.isInteger(boardId) ||
    boardId <= 0
  ) {
    return res.status(400).json({
      message: "Invalid board ID",
    });
  }

  const result = updateBoardSchema.safeParse(
    req.body,
  );

  if (!result.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: result.error.flatten().fieldErrors,
    });
  }

  try {
    const board = await updateBoard(
      req.user.id,
      boardId,
      result.data,
    );

    if (!board) {
      return res.status(404).json({
        message: "Board not found",
      });
    }

    return res.status(200).json({
      message: "Board updated successfully",
      board,
    });
  } catch (error) {
    console.error("Update board error:", error);

    return res.status(500).json({
      message: "Failed to update board",
    });
  }
};

export const deleteBoardController = async (
  req: Request,
  res: Response,
) => {
  if (!req.user) {
    return res.status(401).json({
      message: "Authentication required",
    });
  }

  const boardId = Number(req.params.id);

  if (
    !Number.isInteger(boardId) ||
    boardId <= 0
  ) {
    return res.status(400).json({
      message: "Invalid board ID",
    });
  }

  try {
    const board = await deleteBoard(
      req.user.id,
      boardId,
    );

    if (!board) {
      return res.status(404).json({
        message: "Board not found",
      });
    }

    return res.status(200).json({
      message: "Board deleted successfully",
      board,
    });
  } catch (error) {
    console.error("Delete board error:", error);

    return res.status(500).json({
      message: "Failed to delete board",
    });
  }
};