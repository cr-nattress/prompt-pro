import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { env } from "@/lib/env";

// Lazy singleton so the Redis client isn't created during build
let _redis: Redis | null = null;
function getRedis(): Redis {
	if (!_redis) {
		_redis = new Redis({
			url: env.UPSTASH_REDIS_REST_URL,
			token: env.UPSTASH_REDIS_REST_TOKEN,
		});
	}
	return _redis;
}

// Per-minute sliding window limiters per plan
const PLAN_LIMITS = {
	free: { perMinute: 10, perMonth: 500 },
	pro: { perMinute: 60, perMonth: 10_000 },
	team: { perMinute: 300, perMonth: 100_000 },
} as const;

type Plan = keyof typeof PLAN_LIMITS;

const rateLimiters = new Map<Plan, Ratelimit>();

function getMinuteLimiter(plan: Plan): Ratelimit {
	let limiter = rateLimiters.get(plan);
	if (!limiter) {
		limiter = new Ratelimit({
			redis: getRedis(),
			limiter: Ratelimit.slidingWindow(PLAN_LIMITS[plan].perMinute, "1 m"),
			prefix: `pv:rl:min:${plan}`,
		});
		rateLimiters.set(plan, limiter);
	}
	return limiter;
}

export interface RateLimitResult {
	allowed: boolean;
	limit: number;
	remaining: number;
	reset: number;
}

/**
 * Check both per-minute and monthly rate limits for the given API key.
 * Falls back to allowing all requests if Redis is unreachable (dev mode).
 */
export async function checkRateLimit(
	apiKeyId: string,
	plan: Plan,
): Promise<RateLimitResult> {
	try {
		const redis = getRedis();
		const limits = PLAN_LIMITS[plan];

		// Per-minute check via @upstash/ratelimit
		const minuteResult = await getMinuteLimiter(plan).limit(apiKeyId);

		if (!minuteResult.success) {
			return {
				allowed: false,
				limit: minuteResult.limit,
				remaining: minuteResult.remaining,
				reset: minuteResult.reset,
			};
		}

		// Monthly check via Redis INCR
		const now = new Date();
		const monthKey = `pv:rl:month:${apiKeyId}:${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
		const monthCount = await redis.incr(monthKey);

		// Set TTL on first increment (32 days to cover month boundary)
		if (monthCount === 1) {
			await redis.expire(monthKey, 32 * 24 * 60 * 60);
		}

		if (monthCount > limits.perMonth) {
			return {
				allowed: false,
				limit: limits.perMonth,
				remaining: 0,
				reset: getEndOfMonthTimestamp(),
			};
		}

		return {
			allowed: true,
			limit: minuteResult.limit,
			remaining: minuteResult.remaining,
			reset: minuteResult.reset,
		};
	} catch {
		// Redis unavailable — allow request in development
		const limits = PLAN_LIMITS[plan];
		return {
			allowed: true,
			limit: limits.perMinute,
			remaining: limits.perMinute - 1,
			reset: Date.now() + 60_000,
		};
	}
}

/**
 * Generate rate limit response headers.
 */
export function rateLimitHeaders(
	result: RateLimitResult,
): Record<string, string> {
	return {
		"X-RateLimit-Limit": String(result.limit),
		"X-RateLimit-Remaining": String(result.remaining),
		"X-RateLimit-Reset": String(result.reset),
	};
}

function getEndOfMonthTimestamp(): number {
	const now = new Date();
	const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
	return endOfMonth.getTime();
}
