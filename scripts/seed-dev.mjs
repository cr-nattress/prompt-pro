import postgres from "postgres";

const url = process.env.DATABASE_URL;
if (!url) {
	console.error("DATABASE_URL not set");
	process.exit(1);
}

const isLocal = url.includes("localhost") || url.includes("127.0.0.1");
const sql = postgres(url, isLocal ? {} : { ssl: "require" });

const userId = "00000000-0000-0000-0000-000000000001";
const workspaceId = "00000000-0000-0000-0000-000000000010";
const appId = "00000000-0000-0000-0000-000000000100";

try {
	// Seed dev user
	await sql`
		INSERT INTO prompt.users (id, clerk_id, email, name, first_name, last_name, plan)
		VALUES (${userId}, 'dev_clerk_001', 'dev@localhost', 'Dev User', 'Dev', 'User', 'free')
		ON CONFLICT (id) DO NOTHING
	`;
	console.log("  User seeded");

	// Seed dev workspace
	await sql`
		INSERT INTO prompt.workspaces (id, slug, name, owner_id, plan)
		VALUES (${workspaceId}, 'dev', 'Dev Workspace', ${userId}, 'free')
		ON CONFLICT (id) DO NOTHING
	`;
	console.log("  Workspace seeded");

	// Seed a default app
	await sql`
		INSERT INTO prompt.apps (id, workspace_id, slug, name, description)
		VALUES (${appId}, ${workspaceId}, 'default', 'Default App', 'Default application for development')
		ON CONFLICT (id) DO NOTHING
	`;
	console.log("  Default app seeded");

	console.log("Dev seed complete!");
} catch (err) {
	console.error("Seed failed:", err.message);
	process.exit(1);
} finally {
	await sql.end();
}
