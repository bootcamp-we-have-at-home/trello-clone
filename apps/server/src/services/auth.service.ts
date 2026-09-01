import bcrypt from "bcryptjs";
import {db} from "@trello-clone/db";
import type { RegisterUserInput } from "@trello-clone/schemas";

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