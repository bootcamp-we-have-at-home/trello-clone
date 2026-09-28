import { db } from "@trello-clone/db";
import type { CreateBoardInput } from "../validation/board.js";

export const createBoard = async (
  userId: number,
  { title, workspaceId }: CreateBoardInput,
) => {
  const membershipResult = await db.query(
    `
    SELECT 1
    FROM workspace_members
    WHERE workspace_id = $1
      AND user_id = $2
    `,
    [workspaceId, userId],
  );

  if (membershipResult.rowCount === 0) {
    return null;
  }

  const result = await db.query(
    `
    INSERT INTO boards (title, workspace_id, created_by)
    VALUES ($1, $2, $3)
    RETURNING
      id,
      title,
      workspace_id,
      created_by,
      created_at,
      updated_at
    `,
    [title, workspaceId, userId],
  );

  return result.rows[0];
};
export const getWorkspaceBoards = async (
  userId: number,
  workspaceId: number,
) => {
  const membershipResult = await db.query(
    `
    SELECT 1
    FROM workspace_members
    WHERE workspace_id = $1
      AND user_id = $2
    `,
    [workspaceId, userId],
  );

  if (membershipResult.rowCount === 0) {
    return null;
  }

  const result = await db.query(
    `
    SELECT
      id,
      title,
      workspace_id,
      created_by,
      created_at,
      updated_at
    FROM boards
    WHERE workspace_id = $1
    ORDER BY created_at DESC
    `,
    [workspaceId],
  );

  return result.rows;
};