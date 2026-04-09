import { redirect } from "@tanstack/react-router";
import { auth } from "./auth";
import type { UserRole } from "./types";

export interface AuthContext {
	user: {
		id: string;
		email: string;
		role: UserRole;
		metadata?: {
			name?: string;
			company_name?: string;
		};
	} | null;
}

/**
 * Get current authenticated user
 */
export async function getCurrentAuthUser() {
	try {
		const { user, error } = await auth.getCurrentUser();
		if (error || !user) {
			return null;
		}
		return user;
	} catch {
		return null;
	}
}

/**
 * Middleware to require authentication
 * Redirects to login if not authenticated
 */
export async function requireAuth(role: UserRole) {
	const user = await getCurrentAuthUser();

	if (!user) {
		// Not authenticated, redirect to login
		throw redirect({
			to: `/${role}/auth/login`,
		});
	}

	// Check if user has the correct role
	if (user.role !== role) {
		throw redirect({
			to: `/${user.role}/auth/login`,
		});
	}

	return { user };
}

/**
 * Middleware to redirect authenticated users
 * Used on login/signup pages
 */
export async function redirectIfAuthenticated() {
	const user = await getCurrentAuthUser();

	if (user) {
		// Already authenticated, redirect to dashboard
		throw redirect({
			to: `/${user.role}`,
		});
	}

	return { user: null };
}
