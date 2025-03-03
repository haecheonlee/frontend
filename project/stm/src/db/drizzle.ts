import { loadEnvConfig } from "@next/env";
import { drizzle } from "drizzle-orm/libsql";

const projectDir = process.cwd();
loadEnvConfig(projectDir);

export const db = drizzle({
    connection: {
        url: process.env.TURSO_DATABASE_URL as string,
        authToken: process.env.TURSO_AUTH_TOKEN as string,
    },
});
