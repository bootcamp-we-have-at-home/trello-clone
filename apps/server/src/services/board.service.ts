import { db } from "@trello-clone/db";
import type { CreateBoardInput,UpdateBoardInput, } from "../validation/board.js";

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
export const getBoard = async (
  userId: number,
  boardId: number,
) => {
  const result = await db.query(
    `
    SELECT
      b.id,
      b.title,
      b.workspace_id,
      b.created_by,
      b.created_at,
      b.updated_at
    FROM boards b
    INNER JOIN workspace_members wm
      ON wm.workspace_id = b.workspace_id
    WHERE b.id = $1
      AND wm.user_id = $2
    `,
    [boardId, userId],
  );

  return result.rows[0] ?? null;
};
export const updateBoard = async (
  userId: number,
  boardId: number,
  { title }: UpdateBoardInput,
) => {
  const result = await db.query(
    `
    UPDATE boards b
    SET
      title = $1,
      updated_at = CURRENT_TIMESTAMP
    FROM workspace_members wm
    WHERE b.id = $2
      AND wm.workspace_id = b.workspace_id
      AND wm.user_id = $3
    RETURNING
      b.id,
      b.title,
      b.workspace_id,
      b.created_by,
      b.created_at,
      b.updated_at
    `,
    [title, boardId, userId],
  );

  return result.rows[0] ?? null;
};