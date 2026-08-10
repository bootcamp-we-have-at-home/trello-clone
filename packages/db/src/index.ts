import { Pool } from "pg";
import { env } from "@trello-clone/env/server";

export const db = new Pool({
  connectionString: env.DATABASE_URL,
});