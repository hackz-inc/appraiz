import { redirect } from "@tanstack/react-router";
import { getCurrentUserFn } from "./server";
import type { UserRole } from "./types";

export interface AuthContext {
	user: {
		id: string;
		email: string;
		role: UserRole;
		metadata?: { name?: string; company_name?: string };
	} | null;
}

export async function redirectIfAuthenticated() {
	const session = await getCurrentUserFn();
	if (session) {
		throw redirect({ to: `/${session.role}` });
	}
	return { user: null };
}
