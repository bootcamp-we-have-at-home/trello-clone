import type {
  NextFunction,
  Request,
  Response,
} from "express";
import {
  JsonWebTokenError,
  TokenExpiredError,
} from "jsonwebtoken";
import { getCurrentUser } from "../services/auth.service.js";

export async function authMiddleware(
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

    await getCurrentUser(token);

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);

    if (
      error instanceof JsonWebTokenError ||
      error instanceof TokenExpiredError ||
      (error instanceof Error &&
        error.message === "User not found or inactive")
    ) {
      return res.status(401).json({
        message: "Invalid or expired token",
      });
    }

    return next(error);
  }
}