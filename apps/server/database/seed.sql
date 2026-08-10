INSERT INTO users (username, email, password)
VALUES
('hussein', 'hussein@example.com', 'hashed_password');

INSERT INTO workspaces (name, description, owner_id)
VALUES
('Personal Workspace', 'Main workspace', 1);

INSERT INTO workspace_members (workspace_id, user_id, role)
VALUES
(1, 1, 'owner');

INSERT INTO boards (title, workspace_id, created_by)
VALUES
('Development Board', 1, 1);

INSERT INTO lists (title, position, board_id)
VALUES
('Todo', 1, 1),
('Doing', 2, 1),
('Done', 3, 1);

INSERT INTO cards (title, description, position, list_id, created_by)
VALUES
('Setup Database', 'Create PostgreSQL schema', 1, 1, 1),
('Connect Backend', 'Connect Express to PostgreSQL', 1, 2, 1);