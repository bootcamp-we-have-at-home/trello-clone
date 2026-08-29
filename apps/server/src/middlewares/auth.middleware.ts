import type { NextFunction, Request, Response } from "express";

import { getCurrentUser } from "../services/auth.service.js";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies.session;

    if (!token) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const user = await getCurrentUser(token);

    req.user = user;

    next();
  } catch (error) {
    console.error("Authentication error:", error);

    return res.status(401).json({
      message: "Invalid or expired session",
    });
  }
};