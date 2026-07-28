import { NextResponse } from 'next/server';

interface RateLimitStore {
  [key: string]: { count: number; expiresAt: number };
}

const memoryStore: RateLimitStore = {};

/**
 * In-memory sliding window rate limiter for API endpoints.
 * @param ip Client IP address or identifier
 * @param limit Maximum requests per window
 * @param windowMs Window duration in milliseconds (e.g. 60000 = 1 minute)
 */
export function rateLimit(ip: string, limit: number = 20, windowMs: number = 60000): { success: boolean; remaining: number; reset: number } {
  const now = Date.now();
  const record = memoryStore[ip];

  if (!record || now > record.expiresAt) {
    memoryStore[ip] = {
      count: 1,
      expiresAt: now + windowMs
    };
    return { success: true, remaining: limit - 1, reset: memoryStore[ip].expiresAt };
  }

  if (record.count >= limit) {
    return { success: false, remaining: 0, reset: record.expiresAt };
  }

  record.count += 1;
  return { success: true, remaining: limit - record.count, reset: record.expiresAt };
}

/**
 * Utility to extract client IP from request headers.
 */
export function getClientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = req.headers.get('x-real-ip');
  if (realIp) return realIp.trim();
  return '127.0.0.1';
}
