import type {
  NextFunction,
  Request,
  Response,
} from "express";
import jwt from "jsonwebtoken";
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

    const user = await getCurrentUser(token);

    req.user = user;

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);

    if (
      error instanceof jwt.JsonWebTokenError ||
      error instanceof jwt.TokenExpiredError ||
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