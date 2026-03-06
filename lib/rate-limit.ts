import { NextRequest, NextResponse } from "next/server";

/**
 * Simple in-memory rate limiter for Next.js
 * Usage: call checkRateLimit() at the start of your route handler
 */

interface RateLimitEntry {
  attempts: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * Check if a user has exceeded rate limit
 * @param identifier - Unique identifier (IP, user ID, etc.)
 * @param limit - Max attempts allowed
 * @param windowMs - Time window in milliseconds
 * @returns { allowed: boolean, remaining: number, retryAfter: number }
 */
export function checkRateLimit(
  identifier: string,
  limit: number = 5,
  windowMs: number = 15 * 60 * 1000, // 15 minutes default
): { allowed: boolean; remaining: number; retryAfter: number } {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);

  // If no entry or window expired, create new entry
  if (!entry || now > entry.resetTime) {
    rateLimitStore.set(identifier, {
      attempts: 1,
      resetTime: now + windowMs,
    });
    return { allowed: true, remaining: limit - 1, retryAfter: 0 };
  }

  // Window still active
  const remaining = limit - entry.attempts;
  const retryAfter = Math.ceil((entry.resetTime - now) / 1000); // in seconds

  if (entry.attempts >= limit) {
    return { allowed: false, remaining: 0, retryAfter };
  }

  // Increment attempts
  entry.attempts++;
  return {
    allowed: true,
    remaining: Math.max(0, limit - entry.attempts),
    retryAfter: 0,
  };
}

/**
 * Get client IP from request
 */
export function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  // Try x-real-ip as fallback
  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }

  // Fallback to unknown if no headers available
  return "unknown";
}

/**
 * Create a rate limit error response
 */
export function createRateLimitResponse(retryAfter: number): NextResponse {
  return NextResponse.json(
    {
      error:
        "Terlalu banyak percobaan login. Silakan coba lagi dalam beberapa menit.",
      retryAfter,
    },
    {
      status: 429,
      headers: {
        "Retry-After": retryAfter.toString(),
      },
    },
  );
}

/**
 * Cleanup old entries (should be called periodically)
 */
export function cleanupRateLimitStore() {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

// Cleanup every 5 minutes
if (typeof global !== "undefined") {
  if (!("rateLimitCleanupInterval" in global)) {
    (global as any).rateLimitCleanupInterval = setInterval(
      cleanupRateLimitStore,
      5 * 60 * 1000,
    );
  }
}
