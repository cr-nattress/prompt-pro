import type { WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook } from "svix";

export async function POST(req: Request) {
	const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

	if (!WEBHOOK_SECRET) {
		return NextResponse.json(
			{ error: "Webhook secret not configured" },
			{ status: 500 },
		);
	}

	const headerPayload = await headers();
	const svixId = headerPayload.get("svix-id");
	const svixTimestamp = headerPayload.get("svix-timestamp");
	const svixSignature = headerPayload.get("svix-signature");

	if (!svixId || !svixTimestamp || !svixSignature) {
		return NextResponse.json(
			{ error: "Missing svix headers" },
			{ status: 400 },
		);
	}

	const payload = await req.text();
	const wh = new Webhook(WEBHOOK_SECRET);

	let event: WebhookEvent;
	try {
		event = wh.verify(payload, {
			"svix-id": svixId,
			"svix-timestamp": svixTimestamp,
			"svix-signature": svixSignature,
		}) as WebhookEvent;
	} catch {
		return NextResponse.json(
			{ error: "Invalid webhook signature" },
			{ status: 400 },
		);
	}

	switch (event.type) {
		case "user.created":
			// TODO: Epic 03 — Create user + default workspace in database
			break;
		case "user.updated":
			// TODO: Epic 03 — Sync user profile changes to database
			break;
		case "user.deleted":
			// TODO: Epic 03 — Soft-delete user and associated data
			break;
	}

	return NextResponse.json({ received: true });
}
