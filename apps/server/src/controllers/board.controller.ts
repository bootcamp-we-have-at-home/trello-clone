import type { Request, Response } from "express";
import { createBoardSchema } from "../validation/board.js";
import { createBoard } from "../services/board.service.js";

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
    const board = await createBoard(req.user.id, result.data);

    if (!board) {
      return res.status(403).json({
        message: "You are not a member of this workspace",
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