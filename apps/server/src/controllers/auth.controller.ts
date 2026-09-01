import type { Request, Response } from "express";
import { registerUser } from "../services/auth.service.js";
import { registerUserSchema } from "../schemas/auth.schema.js";

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
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};