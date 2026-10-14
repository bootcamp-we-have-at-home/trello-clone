BEGIN;

ALTER TABLE cards
    ADD COLUMN IF NOT EXISTS board_id INT;

ALTER TABLE cards
    ADD COLUMN IF NOT EXISTS state VARCHAR(30) NOT NULL DEFAULT 'todo';

DO $$
BEGIN
    IF to_regclass('public.lists') IS NOT NULL
       AND EXISTS (
           SELECT 1
           FROM information_schema.columns
           WHERE table_schema = 'public'
             AND table_name = 'cards'
             AND column_name = 'list_id'
       )
       AND EXISTS (
           SELECT 1
           FROM information_schema.columns
           WHERE table_schema = 'public'
             AND table_name = 'lists'
             AND column_name = 'board_id'
       )
       AND EXISTS (
           SELECT 1
           FROM information_schema.columns
           WHERE table_schema = 'public'
             AND table_name = 'lists'
             AND column_name = 'title'
       )
    THEN
        UPDATE cards AS c
        SET
            board_id = l.board_id,
            state = CASE
                WHEN LOWER(TRIM(l.title)) IN ('todo', 'to do')
                    THEN 'todo'
                WHEN LOWER(TRIM(l.title)) = 'doing'
                    THEN 'doing'
                WHEN LOWER(TRIM(l.title)) = 'done'
                    THEN 'done'
                ELSE 'todo'
            END
        FROM lists AS l
        WHERE c.list_id = l.id;
    END IF;
END $$;

ALTER TABLE cards
    DROP COLUMN IF EXISTS list_id,
    DROP COLUMN IF EXISTS position,
    DROP COLUMN IF EXISTS created_by;

DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM cards
        WHERE board_id IS NULL
    ) THEN
        RAISE EXCEPTION
            'Migration failed: some cards have no board_id. Resolve their board assignments before retrying.';
    END IF;
END $$;

ALTER TABLE cards
    ALTER COLUMN board_id SET NOT NULL;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conrelid = 'public.cards'::regclass
          AND conname = 'cards_board_id_fkey'
    ) THEN
        ALTER TABLE cards
            ADD CONSTRAINT cards_board_id_fkey
            FOREIGN KEY (board_id)
            REFERENCES boards(id)
            ON DELETE CASCADE;
    END IF;
END $$;

UPDATE cards
SET state = CASE
    WHEN LOWER(TRIM(state)) IN ('todo', 'to do', 'to_do')
        THEN 'todo'
    WHEN LOWER(TRIM(state)) IN (
        'doing',
        'in_progress',
        'in progress',
        'in-progress',
        'inprogress'
    )
        THEN 'doing'
    WHEN LOWER(TRIM(state)) IN ('done', 'completed', 'complete')
        THEN 'done'
    ELSE 'todo'
END;

ALTER TABLE cards
    ALTER COLUMN state SET NOT NULL;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conrelid = 'public.cards'::regclass
          AND conname = 'cards_state_kanban_check'
    ) THEN
        ALTER TABLE cards
            ADD CONSTRAINT cards_state_kanban_check
            CHECK (state IN ('todo', 'doing', 'done'));
    END IF;
END $$;

COMMIT;