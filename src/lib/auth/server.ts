import { createServerFn } from "@tanstack/react-start";
import { getCookies, setCookie } from "@tanstack/react-start/server";
import { eq } from "drizzle-orm";
import { SignJWT, jwtVerify } from "jose";
import { getDb } from "#/lib/db/client";
import { admin, guest } from "#/lib/db/schema";
import type { Env } from "#/types/cloudflare";
import "#/types/cloudflare";
import type { UserRole } from "./types";

const COOKIE_NAME = "session";

function getJwtSecret(env: Env) {
	const secret = env.JWT_SECRET;
	if (!secret) throw new Error("JWT_SECRET is not set");
	return new TextEncoder().encode(secret);
}

async function hashPassword(password: string): Promise<string> {
	const salt = crypto.getRandomValues(new Uint8Array(16));
	const keyMaterial = await crypto.subtle.importKey(
		"raw",
		new TextEncoder().encode(password),
		"PBKDF2",
		false,
		["deriveBits"],
	);
	const hashBuffer = await crypto.subtle.deriveBits(
		{ name: "PBKDF2", hash: "SHA-256", salt, iterations: 100000 },
		keyMaterial,
		256,
	);
	const toHex = (arr: Uint8Array) =>
		Array.from(arr)
			.map((b) => b.toString(16).padStart(2, "0"))
			.join("");
	return `${toHex(salt)}:${toHex(new Uint8Array(hashBuffer))}`;
}

async function verifyPassword(
	password: string,
	storedHash: string,
): Promise<boolean> {
	const [saltHex, hashHex] = storedHash.split(":");
	const salt = new Uint8Array(
		// biome-ignore lint/style/noNonNullAssertion: guaranteed by hash format
		saltHex.match(/.{2}/g)!.map((b) => Number.parseInt(b, 16)),
	);
	const keyMaterial = await crypto.subtle.importKey(
		"raw",
		new TextEncoder().encode(password),
		"PBKDF2",
		false,
		["deriveBits"],
	);
	const hashBuffer = await crypto.subtle.deriveBits(
		{ name: "PBKDF2", hash: "SHA-256", salt, iterations: 100000 },
		keyMaterial,
		256,
	);
	const newHashHex = Array.from(new Uint8Array(hashBuffer))
		.map((b) => b.toString(16).padStart(2, "0"))
		.join("");
	return hashHex === newHashHex;
}

async function createSessionToken(
	payload: { userId: string; email: string; role: UserRole },
	jwtSecret: Uint8Array,
) {
	return new SignJWT(payload)
		.setProtectedHeader({ alg: "HS256" })
		.setIssuedAt()
		.setExpirationTime("7d")
		.sign(jwtSecret);
}

function setSessionCookie(token: string) {
	setCookie(COOKIE_NAME, token, {
		httpOnly: true,
		secure: true,
		sameSite: "lax",
		maxAge: 60 * 60 * 24 * 7,
		path: "/",
	});
}

type SignUpInput = {
	email: string;
	password: string;
	role: UserRole;
	name?: string;
	company_name?: string;
};

type SignInInput = {
	email: string;
	password: string;
	role: UserRole;
};

export const signUpFn = createServerFn({ method: "POST" })
	.inputValidator((data: SignUpInput) => data)
	.handler(async (ctx) => {
		const { email, password, role, name, company_name } = ctx.data;
		// biome-ignore lint/style/noNonNullAssertion: always set in Cloudflare Worker
		const env = ctx.context!.cloudflare.env;
		const db = getDb(ctx.context!);
		const id = crypto.randomUUID();
		const password_hash = await hashPassword(password);

		if (role === "admin") {
			const existing = await db
				.select({ id: admin.id })
				.from(admin)
				.where(eq(admin.email, email))
				.get();
			if (existing) throw new Error("このメールアドレスは既に使用されています");
			await db.insert(admin).values({ id, email, password_hash });
		} else {
			const existing = await db
				.select({ id: guest.id })
				.from(guest)
				.where(eq(guest.email, email))
				.get();
			if (existing) throw new Error("このメールアドレスは既に使用されています");
			await db.insert(guest).values({
				id,
				email,
				password_hash,
				name: name || "",
				company_name: company_name || "",
			});
		}

		const jwtSecret = getJwtSecret(env);
		const token = await createSessionToken({ userId: id, email, role }, jwtSecret);
		setSessionCookie(token);

		return { user: { id, email, role, metadata: { name, company_name } } };
	});

export const signInFn = createServerFn({ method: "POST" })
	.inputValidator((data: SignInInput) => data)
	.handler(async (ctx) => {
		const { email, password, role } = ctx.data;
		// biome-ignore lint/style/noNonNullAssertion: always set in Cloudflare Worker
		const env = ctx.context!.cloudflare.env;
		const db = getDb(ctx.context!);

		let userId: string | undefined;
		let passwordHash: string | undefined;
		let userEmail: string | undefined;

		if (role === "admin") {
			const user = await db
				.select({
					id: admin.id,
					email: admin.email,
					password_hash: admin.password_hash,
				})
				.from(admin)
				.where(eq(admin.email, email))
				.get();
			userId = user?.id;
			passwordHash = user?.password_hash;
			userEmail = user?.email;
		} else {
			const user = await db
				.select({
					id: guest.id,
					email: guest.email,
					password_hash: guest.password_hash,
				})
				.from(guest)
				.where(eq(guest.email, email))
				.get();
			userId = user?.id;
			passwordHash = user?.password_hash;
			userEmail = user?.email;
		}

		if (!userId || !passwordHash || !userEmail) {
			throw new Error("メールアドレスまたはパスワードが正しくありません");
		}

		const isValid = await verifyPassword(password, passwordHash);
		if (!isValid) {
			throw new Error("メールアドレスまたはパスワードが正しくありません");
		}

		const jwtSecret = getJwtSecret(env);
		const token = await createSessionToken({ userId, email: userEmail, role }, jwtSecret);
		setSessionCookie(token);

		return { user: { id: userId, email: userEmail, role } };
	});

export const signOutFn = createServerFn({ method: "POST" }).handler(
	async () => {
		setCookie(COOKIE_NAME, "", { maxAge: 0, path: "/" });
		return { success: true };
	},
);

export const getCurrentUserFn = createServerFn({ method: "GET" }).handler(
	async (ctx) => {
		const cookies = getCookies();
		const token = cookies[COOKIE_NAME];
		if (!token) return null;

		try {
			// biome-ignore lint/style/noNonNullAssertion: always set in Cloudflare Worker
			const jwtSecret = getJwtSecret(ctx.context!.cloudflare.env);
			const { payload } = await jwtVerify(token, jwtSecret);
			return payload as { userId: string; email: string; role: UserRole };
		} catch {
			return null;
		}
	},
);
