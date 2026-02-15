import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Lazy initialization to avoid errors when Redis env vars are not configured
let _minuteRateLimit: Ratelimit | null = null;
let _dailyRateLimit: Ratelimit | null = null;

function getRedis(): Redis | null {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;

  // Check if URL and token are provided and valid
  if (!url || !token) {
    return null;
  }

  // Validate that URL is a valid HTTPS URL (not a placeholder)
  // Upstash Redis URLs must start with https://
  if (!url.startsWith("https://") || url.includes("your_") || url.includes("example")) {
    return null;
  }

  // Validate that token is not a placeholder
  if (token.includes("your_") || token.includes("example")) {
    return null;
  }

  try {
    return new Redis({ url, token });
  } catch (error) {
    // If Redis client creation fails, return null to use no-op rate limiter
    console.warn("[rate-limit] Failed to initialize Redis client, rate limiting disabled:", error);
    return null;
  }
}

// Check if rate limiting is enabled (Redis is configured)
function isRateLimitingEnabled(): boolean {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;

  if (!url || !token) return false;
  if (!url.startsWith("https://") || url.includes("your_") || url.includes("example")) return false;
  if (token.includes("your_") || token.includes("example")) return false;

  return true;
}

// No-op rate limiter for when Redis is not configured
const noopRateLimiter = {
  limit: async () => ({ success: true, limit: 0, remaining: 0, reset: 0 }),
};

const MINUTE_LIMIT = Number(process.env.RATE_LIMIT_PER_MINUTE) || 10;
const DAILY_LIMIT = Number(process.env.RATE_LIMIT_PER_DAY) || 100;

// Requests per minute (sliding window)
export const minuteRateLimit = {
  limit: async (identifier: string) => {
    if (!isRateLimitingEnabled()) {
      return noopRateLimiter.limit(identifier);
    }
    if (!_minuteRateLimit) {
      const redis = getRedis();
      if (!redis) return noopRateLimiter.limit(identifier);
      _minuteRateLimit = new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(MINUTE_LIMIT, "1 m"),
        prefix: "ratelimit:minute",
      });
    }
    return _minuteRateLimit.limit(identifier);
  },
};

// Requests per day (fixed window)
export const dailyRateLimit = {
  limit: async (identifier: string) => {
    if (!isRateLimitingEnabled()) {
      return noopRateLimiter.limit(identifier);
    }
    if (!_dailyRateLimit) {
      const redis = getRedis();
      if (!redis) return noopRateLimiter.limit(identifier);
      _dailyRateLimit = new Ratelimit({
        redis,
        limiter: Ratelimit.fixedWindow(DAILY_LIMIT, "1 d"),
        prefix: "ratelimit:daily",
      });
    }
    return _dailyRateLimit.limit(identifier);
  },
};

// Export helper to check if rate limiting is enabled
export { isRateLimitingEnabled };
