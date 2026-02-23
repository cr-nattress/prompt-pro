import { readdirSync, readFileSync } from "node:fs";
import postgres from "postgres";

const url = process.env.DATABASE_URL;
if (!url) {
	console.error("DATABASE_URL not set");
	process.exit(1);
}

const isLocal = url.includes("localhost") || url.includes("127.0.0.1");
const sql = postgres(url, isLocal ? {} : { ssl: "require" });

// Read all migration files sorted alphabetically
const migrationFiles = readdirSync("drizzle")
	.filter((f) => f.endsWith(".sql"))
	.sort();

const statements = [];
for (const file of migrationFiles) {
	const content = readFileSync(`drizzle/${file}`, "utf-8");
	const fileStatements = content
		.split("--> statement-breakpoint")
		.map((s) => s.trim())
		.filter(Boolean);
	for (const stmt of fileStatements) {
		statements.push({ file, sql: stmt });
	}
}

console.log(
	`Running ${statements.length} statements from ${migrationFiles.length} migration files...`,
);

for (let i = 0; i < statements.length; i++) {
	const { file, sql: stmt } = statements[i];
	try {
		await sql.unsafe(stmt);
		console.log(`  [${i + 1}/${statements.length}] OK (${file})`);
	} catch (err) {
		console.error(
			`  [${i + 1}/${statements.length}] FAILED (${file}): ${err.message}`,
		);
		// Continue on "already exists" errors, fail on others
		if (!err.message.includes("already exists")) {
			await sql.end();
			process.exit(1);
		}
	}
}

console.log("Migration complete!");
await sql.end();
