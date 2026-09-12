CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    avatar TEXT,
    state VARCHAR(20) NOT NULL DEFAULT 'active',
    CONSTRAINT users_state_check
        CHECK (state IN ('active', 'inactive')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX users_email_lower_unique
ON users (LOWER(email));
CREATE TABLE workspaces (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    owner_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_workspace_owner
        FOREIGN KEY (owner_id)
        REFERENCES users(id)
        ON DELETE RESTRICT
);
CREATE TYPE workspace_role AS ENUM (
    'admin',
    'member'
);
CREATE TABLE workspace_members (
    workspace_id INT,
    user_id INT,
    role workspace_role DEFAULT 'member',
    PRIMARY KEY (workspace_id, user_id),

    FOREIGN KEY (workspace_id)
        REFERENCES workspaces(id)
        ON DELETE CASCADE,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE RESTRICT
);
CREATE TABLE boards (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    workspace_id INT NOT NULL,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (workspace_id)
        REFERENCES workspaces(id)
        ON DELETE CASCADE,

    FOREIGN KEY (created_by)
        REFERENCES users(id)
        ON DELETE RESTRICT
);
CREATE TABLE cards (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    state VARCHAR(30) NOT NULL DEFAULT 'todo',
    due_date DATE,
    board_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (board_id)
        REFERENCES boards(id)
        ON DELETE CASCADE
);
CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    card_id INT NOT NULL,
    user_id INT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (card_id)
        REFERENCES cards(id)
        ON DELETE CASCADE,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE RESTRICT
);
CREATE TABLE labels (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    color VARCHAR(20) NOT NULL,
    workspace_id INT NOT NULL,

    FOREIGN KEY (workspace_id)
        REFERENCES workspaces(id)
        ON DELETE CASCADE
);
CREATE TABLE card_labels (
    card_id INT,
    label_id INT,

    PRIMARY KEY (card_id, label_id),

    FOREIGN KEY (card_id)
        REFERENCES cards(id)
        ON DELETE CASCADE,

    FOREIGN KEY (label_id)
        REFERENCES labels(id)
        ON DELETE CASCADE
);

CREATE TABLE CardAssignee (
    card_id INT,
    user_id INT,

    PRIMARY KEY (card_id, user_id),

    FOREIGN KEY (card_id)
        REFERENCES cards(id)
        ON DELETE CASCADE,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE RESTRICT
);
CREATE TABLE attachments (
    id SERIAL PRIMARY KEY,
    card_id INT NOT NULL,
    file_name VARCHAR(255),
    file_url TEXT NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (card_id)
        REFERENCES cards(id)
        ON DELETE CASCADE
);
CREATE TABLE activities (
    id SERIAL PRIMARY KEY,
    card_id INT NOT NULL,
    user_id INT NOT NULL,
    action TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (card_id)
        REFERENCES cards(id)
        ON DELETE CASCADE,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE RESTRICT
);