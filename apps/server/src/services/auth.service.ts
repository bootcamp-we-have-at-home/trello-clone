import bcrypt from "bcryptjs";
import {db} from "@trello-clone/db";
import type { RegisterUserInput } from "@trello-clone/schemas";
import crypto from "node:crypto";

export const registerUser = async ({
  username,
  email,
  password,
}: RegisterUserInput) => {
    // Check if username or email already exists
  const existingUser = await db.query(
    `
    SELECT id
    FROM users
    WHERE username = $1 OR email = $2
    LIMIT 1
    `,
    [username, email],
  );

  if (existingUser.rows.length > 0) {
    throw new Error("Username or email already exists");
  }

  // Hash password
  const passwordHash = await bcrypt.hash(password, 12);

  // Create user
  const result = await db.query(
    `
    INSERT INTO users (
      username,
      email,
      password_hash
    )
    VALUES ($1, $2, $3)
    RETURNING id, username, email, state, created_at
    `,
    [username, email, passwordHash],
  );

  return result.rows[0];
};

export async function loginUser(email: string, password: string) {
  const result = await db.query(
    `SELECT id, username, email, password_hash, state
     FROM users
     WHERE email = $1`,
    [email],
  );

  if (result.rows.length === 0) {
    throw new Error("Invalid email or password");
  }

  const user = result.rows[0];

  const passwordMatch = await bcrypt.compare(
    password,
    user.password_hash,
  );

  if (!passwordMatch) {
    throw new Error("Invalid email or password");
  }

  return {
    id: user.id,
    username: user.username,
    email: user.email,
    state: user.state,
  };
}
export async function createSession(userId: number) {
  // Generate a random session token
  const token = crypto.randomBytes(32).toString("hex");

  // Set session expiration to 7 days
  const expiresAt = new Date();

  expiresAt.setDate(expiresAt.getDate() + 7);

  // Save the session in PostgreSQL
  const result = await db.query(
    `
    INSERT INTO sessions (
      user_id,
      token,
      expires_at
    )
    VALUES ($1, $2, $3)
    RETURNING id, user_id, token, expires_at
    `,
    [userId, token, expiresAt],
  );

  return result.rows[0];
}
export async function getCurrentUser(token: string) {
  const result = await db.query(
    `
    SELECT
      users.id,
      users.username,
      users.email,
      users.state
    FROM sessions
    JOIN users ON users.id = sessions.user_id
    WHERE sessions.token = $1
      AND sessions.expires_at > NOW()
    LIMIT 1
    `,
    [token],
  );

  if (result.rows.length === 0) {
    throw new Error("Invalid or expired session");
  }

  return result.rows[0];
}
export async function deleteSession(token: string) {
  await db.query(
    `
    DELETE FROM sessions
    WHERE token = $1
    `,
    [token],
  );
}
