import { readFileSync } from "node:fs";
import postgres from "postgres";

const url = process.env.DATABASE_URL;
if (!url) {
	console.error("DATABASE_URL not set");
	process.exit(1);
}

const isLocal = url.includes("localhost") || url.includes("127.0.0.1");
const sql = postgres(url, isLocal ? {} : { ssl: "require" });

const migration = readFileSync("drizzle/0000_rainy_scorpion.sql", "utf-8");

// Split on the drizzle statement breakpoint marker and run each statement
const statements = migration
	.split("--> statement-breakpoint")
	.map((s) => s.trim())
	.filter(Boolean);

console.log(`Running ${statements.length} statements...`);

for (let i = 0; i < statements.length; i++) {
	try {
		await sql.unsafe(statements[i]);
		console.log(`  [${i + 1}/${statements.length}] OK`);
	} catch (err) {
		console.error(`  [${i + 1}/${statements.length}] FAILED: ${err.message}`);
		// Continue on "already exists" errors, fail on others
		if (!err.message.includes("already exists")) {
			await sql.end();
			process.exit(1);
		}
	}
}

console.log("Migration complete!");
await sql.end();
