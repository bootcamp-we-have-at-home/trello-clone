import type { Request, Response } from "express";
import { rateLimit } from "express-rate-limit";

const windowMs = 15 * 60 * 1000;
const requestWasSuccessful = (
  _req: Request,
  res: Response,
) => res.statusCode !== 401;

export const loginIpRateLimit = rateLimit({
  windowMs,
  limit: 20,
  skipSuccessfulRequests: true,
  requestWasSuccessful,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    message:
      "Too many login attempts. Please try again later.",
  },
});

export const loginAccountRateLimit = rateLimit({
  windowMs,
  limit: 5,
  skipSuccessfulRequests: true,
  requestWasSuccessful,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  keyGenerator: (req) => {
    const email =
      typeof req.body?.email === "string"
        ? req.body.email.trim().toLowerCase()
        : "unknown";

    return `${req.ip}:${email}`;
  },
  message: {
    message:
      "Too many login attempts. Please try again later.",
  },
});