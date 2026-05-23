import { signInFn, signOutFn, signUpFn, getCurrentUserFn } from "./server";
import type { AuthUser, SignInData, SignUpData } from "./types";

export const auth = {
	async signIn(
		data: SignInData,
	): Promise<{ user: AuthUser | null; error: Error | null }> {
		try {
			const result = await signInFn({ data });
			return {
				user: { id: result.user.id, email: result.user.email, role: result.user.role },
				error: null,
			};
		} catch (e) {
			return { user: null, error: e as Error };
		}
	},

	async signUp(
		data: SignUpData,
	): Promise<{ user: AuthUser | null; error: Error | null }> {
		try {
			const result = await signUpFn({ data });
			return {
				user: {
					id: result.user.id,
					email: result.user.email,
					role: result.user.role,
					metadata: { name: data.name, company_name: data.company_name },
				},
				error: null,
			};
		} catch (e) {
			return { user: null, error: e as Error };
		}
	},

	async signOut(): Promise<{ error: Error | null }> {
		try {
			await signOutFn();
			return { error: null };
		} catch (e) {
			return { error: e as Error };
		}
	},

	async getCurrentUser(): Promise<{ user: AuthUser | null; error: Error | null }> {
		try {
			const session = await getCurrentUserFn();
			if (!session) return { user: null, error: null };
			return {
				user: { id: session.userId, email: session.email, role: session.role },
				error: null,
			};
		} catch (e) {
			return { user: null, error: e as Error };
		}
	},
};
