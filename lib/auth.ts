import { hash, compare } from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";

/**
 * Utility functions for authentication
 */

const SALT_ROUNDS = 12;

/**
 * Hash a password using bcryptjs
 */
export async function hashPassword(password: string): Promise<string> {
  return hash(password, SALT_ROUNDS);
}

/**
 * Compare a password with its hash
 */
export async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return compare(password, hash);
}

/**
 * Get JWT secret from environment, throw error if not set
 */
export function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error(
      "JWT_SECRET environment variable must be set and at least 32 characters long",
    );
  }

  return new TextEncoder().encode(secret);
}

/**
 * Create a JWT token for admin
 */
export async function createAdminToken(): Promise<string> {
  const secret = getJwtSecret();
  const alg = "HS256";

  const jwt = await new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(secret);

  return jwt;
}

/**
 * Verify and decode a JWT token
 */
export async function verifyJwtToken(token: string) {
  const secret = getJwtSecret();
  return jwtVerify(token, secret);
}

/**
 * Validate password format
 * - Minimum 8 characters
 * - At least 1 uppercase letter
 * - At least 1 lowercase letter
 * - At least 1 number
 */
export function validatePasswordFormat(password: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("Password harus minimal 8 karakter");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Password harus mengandung minimal 1 huruf besar");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Password harus mengandung minimal 1 huruf kecil");
  }

  if (!/[0-9]/.test(password)) {
    errors.push("Password harus mengandung minimal 1 angka");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
