import { z } from "zod";

export const createWorkspaceSchema = z.object({
  name: z
    .string()
    .min(1, "Workspace name is required")
    .min(3, "Workspace name must be at least 3 characters")
    .max(100, "Workspace name must be at most 100 characters"),
});

export type CreateWorkspaceInput = z.infer<
  typeof createWorkspaceSchema
>;