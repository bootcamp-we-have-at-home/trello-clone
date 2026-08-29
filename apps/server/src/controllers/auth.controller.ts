import type { Request, Response } from "express";

import { loginSchema } from "../schemas/auth.schema.js";
import { registerUserSchema } from "@trello-clone/schemas";

import {
  registerUser,
  loginUser,
  createSession,
  getCurrentUser,
  deleteSession,
} from "../services/auth.service.js";

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
    // Validate login data
    const result = loginSchema.safeParse(req.body);

    // Return validation error
    if (!result.success) {
      return res.status(400).json({
        message:
          result.error.issues[0]?.message ??
          "Invalid login data",
      });
    }

    // Get validated data
    const { email, password } = result.data;

    // Find user and verify password
    const user = await loginUser(email, password);

    // Create authentication session
    const session = await createSession(user.id);

    // Store session token in HTTP-only cookie
    res.cookie("session", session.token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Return successful response
    return res.status(200).json({
      message: "Login successful",
      user,
    });
  } catch (error) {
    // Log server error
    console.error(error);

    // Return invalid credentials error
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
    // Get session token from cookie
    const token = req.cookies.session;

    // Check if session cookie exists
    if (!token) {
      return res.status(401).json({
        message: "Not authenticated",
      });
    }

    // Find current user
    const user = await getCurrentUser(token);

    return res.status(200).json({
      user,
    });
  } catch (error) {
    console.error(error);

    return res.status(401).json({
      message: "Invalid or expired session",
    });
  }
}
export async function logoutController(req: Request, res: Response) {
  try {
    const token = req.cookies.session;

    if (token) {
      await deleteSession(token);
    }

    res.clearCookie("session", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
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
