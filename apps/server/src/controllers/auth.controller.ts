import type { Request, Response } from "express";
import {
  loginSchema,
  registerUserSchema,
} from "@trello-clone/schemas";

import {
  registerUser,
  loginUser,
  createToken,
  getCurrentUser,
} from "../services/auth.service.js";
const isProduction = process.env.NODE_ENV === "production";

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

export async function loginController(
  req: Request,
  res: Response,
) {
  try {
    const result = loginSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message:
          result.error.issues[0]?.message ??
          "Invalid login data",
      });
    }

    const { email, password } = result.data;

    const user = await loginUser(
      email,
      password,
    );

    // Create JWT
    const token = createToken(user.id);

    // Store JWT in HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Login successful",
      user,
    });
  } catch (error) {
    console.error(error);

    return res.status(401).json({
      message: "Invalid email or password",
    });
  }
}

export async function meController(
  req: Request,
  res: Response,
) {
  try {
    // Get JWT from cookie
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        message: "Not authenticated",
      });
    }

    // Verify JWT and get current user
    const user = await getCurrentUser(token);

    return res.status(200).json({
      user,
    });
  } catch (error) {
    console.error(error);

    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
}

export async function logoutController(
  _req: Request,
  res: Response,
) {
  try {
    // Remove JWT cookie
    res.clearCookie("token", {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
    });

    return res.status(200).json({
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Logout error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}