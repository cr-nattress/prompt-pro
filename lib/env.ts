import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
	server: {
		DATABASE_URL: z.string().url(),
		CLERK_SECRET_KEY: z.string().min(1),
		ANTHROPIC_API_KEY: z.string().min(1),
		STRIPE_SECRET_KEY: z.string().min(1),
		UPSTASH_REDIS_REST_URL: z.string().url(),
		UPSTASH_REDIS_REST_TOKEN: z.string().min(1),
	},
	client: {
		NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),
		NEXT_PUBLIC_APP_URL: z.string().url(),
	},
	runtimeEnv: {
		DATABASE_URL: process.env.DATABASE_URL,
		CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
		ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
		STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
		UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
		UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
		NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
			process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
		NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
	},
	skipValidation: !!process.env.SKIP_ENV_VALIDATION,
	emptyStringAsUndefined: true,
});
