import { loadEnvConfig } from "@next/env";
import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";

const projectDir = process.cwd();
loadEnvConfig(projectDir);

const sqlite = new Database(process.env.DB_FILE_NAME);
export const db = drizzle({ client: sqlite });
