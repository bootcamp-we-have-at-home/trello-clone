import type { NextFunction, Request, Response } from "express";

import { verifyToken } from "../services/auth.service.js";

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        message: "Not authenticated",
      });
    }

    verifyToken(token);

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);

    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
}