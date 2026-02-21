import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const url = process.env.DATABASE_URL as string;
const isLocal = url.includes("localhost") || url.includes("127.0.0.1");

const client = postgres(url, isLocal ? {} : { ssl: "require" });
export const db = drizzle({ client, schema });

export * from "./schema";
