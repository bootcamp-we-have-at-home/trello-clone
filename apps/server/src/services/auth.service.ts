import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "@trello-clone/env/server";
import { db } from "@trello-clone/db";
import type { RegisterUserInput } from "@trello-clone/schemas";

const JWT_SECRET = env.JWT_SECRET;

export const registerUser = async ({
  username,
  email,
  password,
}: RegisterUserInput) => {
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

  const passwordHash = await bcrypt.hash(password, 12);

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

export async function loginUser(
  email: string,
  password: string,
) {
  const result = await db.query(
    `
    SELECT id, username, email, password_hash, state
    FROM users
    WHERE email = $1
    `,
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

export function createToken(userId: number) {
  return jwt.sign(
    { userId },
    JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );
}

export function verifyToken(token: string) {
  const payload = jwt.verify(
    token,
    JWT_SECRET,
  ) as jwt.JwtPayload;

  if (
    typeof payload.userId !== "number"
  ) {
    throw new Error("Invalid token");
  }

  return payload.userId;
}

export async function getCurrentUser(
  token: string,
) {
  const userId = verifyToken(token);

  const result = await db.query(
    `
    SELECT
      id,
      username,
      email,
      state
    FROM users
    WHERE id = $1
    LIMIT 1
    `,
    [userId],
  );

  if (result.rows.length === 0) {
    throw new Error("User not found");
  }

  return result.rows[0];
}
