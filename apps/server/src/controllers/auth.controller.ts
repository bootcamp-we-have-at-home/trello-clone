import type { Request, Response } from "express";

import { registerUserSchema } from "@trello-clone/schemas";

import { registerUser } from "../services/auth.service.js";

export const registerController = async (
  req: Request,
  res: Response,
) => {
  try {
    const result = registerUserSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: result.error.flatten().fieldErrors,
      });
    }

    const user = await registerUser(result.data);

    return res.status(201).json({
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    console.error("Register error:", error);

    if (
      error instanceof Error &&
      error.message === "Username or email already exists"
    ) {
      return res.status(409).json({
        message: "Username or email already exists",
      });
    }

    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "23505"
    ) {
      return res.status(409).json({
        message: "Username or email already exists",
      });
    }

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};