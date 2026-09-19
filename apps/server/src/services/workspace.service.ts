import { db } from "@trello-clone/db";
import type { CreateWorkspaceInput } from "../validation/workspace.js";

export const createWorkspace = async (
  userId: number,
  { name, description }: CreateWorkspaceInput,
) => {
  const client = await db.connect();

  try {
    await client.query("BEGIN");

    const workspaceResult = await client.query(
      `
      INSERT INTO workspaces (name, description, owner_id)
      VALUES ($1, $2, $3)
      RETURNING id, name, description, owner_id, created_at, updated_at
      `,
      [name, description ?? null, userId],
    );

    const workspace = workspaceResult.rows[0];

    await client.query(
      `
      INSERT INTO workspace_members (workspace_id, user_id, role)
      VALUES ($1, $2, 'admin')
      `,
      [workspace.id, userId],
    );

    await client.query("COMMIT");

    return workspace;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};
export const getUserWorkspaces = async (userId: number) => {
  const result = await db.query(
    `
    SELECT
      w.id,
      w.name,
      w.description,
      w.owner_id,
      w.created_at,
      w.updated_at,
      wm.role
    FROM workspaces w
    INNER JOIN workspace_members wm
      ON wm.workspace_id = w.id
    WHERE wm.user_id = $1
    ORDER BY w.created_at DESC
    `,
    [userId],
  );

  return result.rows;
};