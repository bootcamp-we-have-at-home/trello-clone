import { db } from "@trello-clone/db";
interface CreateWorkspaceData {
  name: string;
  ownerId: number;
}

export async function createWorkspace({
  name,
  ownerId,
}: CreateWorkspaceData) {
  const client = await db.connect();

  try {
    await client.query("BEGIN");

    // Create workspace
    const workspaceResult = await client.query(
      `
      INSERT INTO workspaces (name, owner_id)
      VALUES ($1, $2)
      RETURNING id, name, description, owner_id, created_at, updated_at
      `,
      [name, ownerId],
    );

    const workspace = workspaceResult.rows[0];

    // Add owner as a workspace member
    await client.query(
      `
      INSERT INTO workspace_members (workspace_id, user_id, role)
      VALUES ($1, $2, $3)
      `,
      [workspace.id, ownerId, "admin"],
    );

    await client.query("COMMIT");

    return workspace;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function getUserWorkspaces(userId: number) {
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
      ON w.id = wm.workspace_id
    WHERE wm.user_id = $1
    ORDER BY w.created_at DESC
    `,
    [userId],
  );

  return result.rows;
}