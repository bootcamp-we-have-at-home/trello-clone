import type { Request, Response } from "express";
import { registerUser } from "../services/auth.service.js";

export const registerController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { username, email, password } = req.body;

    const user = await registerUser({
      username,
      email,
      password,
    });

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