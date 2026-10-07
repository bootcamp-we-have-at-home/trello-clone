import type { Request, Response } from "express";

import { getBoardCards } from "../services/card.service.js";

export const getBoardCardsController = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({
      message: "Authentication required",
    });
  }

  const boardId = Number(req.params.boardId);

  if (!Number.isInteger(boardId) || boardId <= 0) {
    return res.status(400).json({
      message: "Invalid board ID",
    });
  }

  try {
    const cards = await getBoardCards(req.user.id, boardId);

    return res.status(200).json({
      cards,
    });
  } catch (error) {
    console.error("Get board cards error:", error);

    return res.status(500).json({
      message: "Failed to fetch board cards",
    });
  }
};
