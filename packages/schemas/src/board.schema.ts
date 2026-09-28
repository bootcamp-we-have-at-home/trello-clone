import { z } from "zod";

export const createBoardSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Board title is required")
    .max(100, "Board title must be at most 100 characters"),

  workspaceId: z
    .number()
    .int()
    .positive("Workspace ID must be a positive number"),
});

export const updateBoardSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Board title is required")
    .max(100, "Board title must be at most 100 characters"),
});

export type CreateBoardInput = z.infer<typeof createBoardSchema>;

export type UpdateBoardInput = z.infer<typeof updateBoardSchema>;