import type { WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook } from "svix";
import { createUser, deleteUser, updateUser } from "@/lib/db/queries/users";
import { createWorkspace } from "@/lib/db/queries/workspaces";

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
		case "user.created": {
			const { id, email_addresses, first_name, last_name, image_url } =
				event.data;
			const email = email_addresses[0]?.email_address ?? "";
			const name = [first_name, last_name].filter(Boolean).join(" ") || email;

			const dbUser = await createUser({
				clerkId: id,
				email,
				name,
				firstName: first_name ?? undefined,
				lastName: last_name ?? undefined,
				imageUrl: image_url ?? undefined,
			});

			const slug = email.split("@")[0] ?? "default";
			await createWorkspace({
				slug: `${slug}-${dbUser.id.slice(0, 8)}`,
				name: first_name ? `${first_name}'s Workspace` : "My Workspace",
				ownerId: dbUser.id,
			});
			break;
		}
		case "user.updated": {
			const { id, email_addresses, first_name, last_name, image_url } =
				event.data;
			const email = email_addresses[0]?.email_address ?? "";
			const name = [first_name, last_name].filter(Boolean).join(" ") || email;

			await updateUser(id, {
				email,
				name,
				firstName: first_name ?? undefined,
				lastName: last_name ?? undefined,
				imageUrl: image_url ?? undefined,
			});
			break;
		}
		case "user.deleted": {
			const { id } = event.data;
			if (id) {
				await deleteUser(id);
			}
			break;
		}
	}

	return NextResponse.json({ received: true });
}
