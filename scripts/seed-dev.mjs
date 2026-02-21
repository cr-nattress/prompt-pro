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

	// Seed a sample blueprint
	const blueprintId = "00000000-0000-0000-0000-000000001000";
	await sql`
		INSERT INTO prompt.context_blueprints (id, app_id, workspace_id, slug, name, description, target_llm, total_token_budget)
		VALUES (
			${blueprintId},
			${appId},
			${workspaceId},
			'customer-support-agent',
			'Customer Support Agent',
			'Context blueprint for a customer support chatbot with product knowledge and conversation history',
			'gpt-4o',
			8000
		)
		ON CONFLICT (id) DO NOTHING
	`;
	console.log("  Sample blueprint seeded");

	// Seed sample blocks
	await sql`
		INSERT INTO prompt.context_blocks (id, blueprint_id, type, slug, name, description, content, position, is_required, is_conditional)
		VALUES
			(
				'00000000-0000-0000-0000-000000002001',
				${blueprintId},
				'system',
				'system-prompt',
				'System Prompt',
				'Core system instructions for the support agent',
				'You are a helpful customer support agent for Acme Corp. Be polite, concise, and helpful. Always try to resolve the customer''s issue. If you cannot help, escalate to a human agent.',
				0,
				true,
				false
			),
			(
				'00000000-0000-0000-0000-000000002002',
				${blueprintId},
				'examples',
				'few-shot-examples',
				'Few-Shot Examples',
				'Example conversations for tone and style',
				'User: I can''t log in to my account.\nAssistant: I''m sorry to hear that. Let me help you regain access. Could you tell me the email address associated with your account?\n\nUser: When will my order arrive?\nAssistant: I''d be happy to check on your order status. Could you provide your order number? You can find it in your confirmation email.',
				1,
				false,
				false
			),
			(
				'00000000-0000-0000-0000-000000002003',
				${blueprintId},
				'task',
				'user-query',
				'User Query',
				'The current user message to respond to',
				'Respond to the following customer message:\n\n{{user_message}}',
				2,
				true,
				false
			)
		ON CONFLICT (id) DO NOTHING
	`;
	console.log("  Sample blocks seeded");

	// Seed a sample prompt with versions
	const promptId = "00000000-0000-0000-0000-000000003000";
	await sql`
		INSERT INTO prompt.prompt_templates (id, app_id, workspace_id, slug, name, purpose, description, tags)
		VALUES (
			${promptId},
			${appId},
			${workspaceId},
			'code-review',
			'Code Review Assistant',
			'code-generation',
			'A prompt template for automated code review',
			ARRAY['code', 'review', 'assistant']
		)
		ON CONFLICT (id) DO NOTHING
	`;

	await sql`
		INSERT INTO prompt.prompt_versions (id, prompt_template_id, version, template_text, llm, change_note, status)
		VALUES
			(
				'00000000-0000-0000-0000-000000003001',
				${promptId},
				1,
				'Review the following code and provide feedback.\n\n{{code}}',
				'gpt-4o',
				'Initial version',
				'active'
			),
			(
				'00000000-0000-0000-0000-000000003002',
				${promptId},
				2,
				'You are an expert code reviewer. Review the following code for bugs, performance issues, and best practices.\n\nLanguage: {{language}}\n\n```\n{{code}}\n```\n\nProvide your review in a structured format with sections for Issues, Suggestions, and Overall Assessment.',
				'gpt-4o',
				'Enhanced with structured output and language parameter',
				'draft'
			)
		ON CONFLICT (id) DO NOTHING
	`;
	console.log("  Sample prompt with versions seeded");

	// Seed a blueprint version
	await sql`
		INSERT INTO prompt.blueprint_versions (id, blueprint_id, version, block_version_snapshot, change_note, status)
		VALUES (
			'00000000-0000-0000-0000-000000004001',
			${blueprintId},
			1,
			'{}',
			'Initial blueprint version',
			'active'
		)
		ON CONFLICT (id) DO NOTHING
	`;
	console.log("  Sample blueprint version seeded");

	// Seed a dev API key (SHA-256 hash of "pv_test_devkey1234567890abcdef")
	// To generate: echo -n "pv_test_devkey1234567890abcdef" | shasum -a 256
	const apiKeyId = "00000000-0000-0000-0000-000000005001";
	const devKeyHash =
		"a1f0c3e4b5d6a7e8f9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2";
	await sql`
		INSERT INTO prompt.api_keys (id, workspace_id, key_hash, label, scopes, app_id)
		VALUES (
			${apiKeyId},
			${workspaceId},
			${devKeyHash},
			'Dev Test Key',
			ARRAY['read', 'resolve', 'write', 'admin'],
			NULL
		)
		ON CONFLICT (id) DO NOTHING
	`;
	console.log("  Dev API key seeded");

	console.log("Dev seed complete!");
} catch (err) {
	console.error("Seed failed:", err.message);
	process.exit(1);
} finally {
	await sql.end();
}
