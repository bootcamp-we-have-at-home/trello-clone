import { z } from "zod";

export const registerUserSchema = z
  .object({
    username: z
      .string()
      .min(1, "Username is required")
      .min(3, "Username must be at least 3 characters")
      .max(50, "Username must be at most 50 characters"),

    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email")
      .max(255, "Email must be at most 255 characters"),

    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters"),

    confirmPassword: z
      .string()
      .min(1, "Please confirm your password"),
  })
  .refine(
    (data) => data.password === data.confirmPassword,
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    },
  );

export type RegisterUserInput = z.infer<
  typeof registerUserSchema
>;