BEGIN;

-- Add the board reference required by the Kanban board.
ALTER TABLE cards
ADD COLUMN board_id INT;

-- Add the Kanban state.
ALTER TABLE cards
ADD COLUMN state VARCHAR(30) NOT NULL DEFAULT 'todo';

-- Fill board_id and state using the existing lists.
UPDATE cards c
SET
    board_id = l.board_id,
    state = CASE
        WHEN LOWER(l.title) = 'todo' THEN 'todo'
        WHEN LOWER(l.title) = 'doing' THEN 'doing'
        WHEN LOWER(l.title) = 'done' THEN 'done'
        ELSE 'todo'
    END
FROM lists l
WHERE c.list_id = l.id;

-- board_id must exist for every card.
ALTER TABLE cards
ALTER COLUMN board_id SET NOT NULL;

-- Keep board references valid.
ALTER TABLE cards
ADD CONSTRAINT cards_board_id_fkey
FOREIGN KEY (board_id)
REFERENCES boards(id)
ON DELETE CASCADE;

COMMIT;