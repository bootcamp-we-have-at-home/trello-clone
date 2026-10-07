import { db } from "@trello-clone/db";

export const getBoardCards = async (userId: number, boardId: number) => {
  const result = await db.query(
    `
    SELECT
      c.id,
      c.title,
      c.description,
      c.state,
      c.due_date,
      c.board_id,
      c.created_at,
      c.updated_at
    FROM cards c
    INNER JOIN boards b
      ON b.id = c.board_id
    INNER JOIN workspace_members wm
      ON wm.workspace_id = b.workspace_id
    WHERE c.board_id = $1
      AND wm.user_id = $2
    ORDER BY c.created_at ASC
    `,
    [boardId, userId],
  );

  return result.rows;
};
