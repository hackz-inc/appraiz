import { createServerFn } from "@tanstack/react-start";
import { and, desc, eq } from "drizzle-orm";
import { getDb } from "#/lib/db/client";
import { guest, hackathon, hackathon_guest, scoring_item, scoring_result, team } from "#/lib/db/schema";
import "#/types/cloudflare";
import type { Hackathon, SafeGuest } from "#/lib/db/types";

type CreateHackathonInput = { name: string; scoringDate: string };
type UpdateHackathonInput = { id: string; name: string; scoringDate: string };

function generatePassword(length = 8): string {
	const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
	return Array.from(crypto.getRandomValues(new Uint8Array(length)))
		.map((b) => chars[b % chars.length])
		.join("");
}

export const createHackathon = createServerFn({ method: "POST" })
	.inputValidator((data: CreateHackathonInput) => data)
	.handler(async (ctx) => {
		const { name, scoringDate } = ctx.data;
		const db = getDb(ctx.context!);
		const id = crypto.randomUUID();
		const accessPassword = generatePassword();
		await db.insert(hackathon).values({
			id,
			name,
			scoring_date: scoringDate,
			access_password: accessPassword,
		});
		return { id, accessPassword };
	});

export const updateHackathon = createServerFn({ method: "POST" })
	.inputValidator((data: UpdateHackathonInput) => data)
	.handler(async (ctx) => {
		const { id, name, scoringDate } = ctx.data;
		const db = getDb(ctx.context!);
		await db
			.update(hackathon)
			.set({ name, scoring_date: scoringDate })
			.where(eq(hackathon.id, id));
		return { success: true };
	});

export const fetchHackathons = createServerFn({ method: "GET" }).handler(
	async (ctx) => {
		const db = getDb(ctx.context!);
		const data = await db
			.select()
			.from(hackathon)
			.orderBy(desc(hackathon.created_at));
		return data as Hackathon[];
	},
);

export const fetchAllGuests = createServerFn({ method: "GET" }).handler(
	async (ctx) => {
		const db = getDb(ctx.context!);
		const data = await db
			.select({
				id: guest.id,
				name: guest.name,
				company_name: guest.company_name,
				email: guest.email,
				created_at: guest.created_at,
				updated_at: guest.updated_at,
			})
			.from(guest)
			.orderBy(desc(guest.created_at));
		return data as SafeGuest[];
	},
);

export const fetchHackathonById = createServerFn({ method: "GET" })
	.inputValidator((id: string) => id)
	.handler(async (ctx) => {
		const id = ctx.data;
		const db = getDb(ctx.context!);

		const data = await db.query.hackathon.findFirst({
			where: eq(hackathon.id, id),
			with: {
				teams: true,
				scoring_items: true,
				hackathon_guests: {
					with: {
						guest: {
							columns: {
								id: true,
								name: true,
								company_name: true,
								email: true,
								created_at: true,
								updated_at: true,
							},
						},
					},
				},
			},
		});

		if (!data) throw new Error("Hackathon not found");
		return data;
	});

type CreateTeamInput = { hackathonId: string; name: string; topazLink?: string };

export const createTeam = createServerFn({ method: "POST" })
	.inputValidator((data: CreateTeamInput) => data)
	.handler(async (ctx) => {
		const { hackathonId, name, topazLink } = ctx.data;
		const db = getDb(ctx.context!);
		const id = crypto.randomUUID();
		await db.insert(team).values({
			id,
			name,
			hackathon_id: hackathonId,
			topaz_link: topazLink || null,
		});
		return { id };
	});

export const deleteTeam = createServerFn({ method: "POST" })
	.inputValidator((id: string) => id)
	.handler(async (ctx) => {
		const db = getDb(ctx.context!);
		await db.delete(team).where(eq(team.id, ctx.data));
		return { success: true };
	});

type CreateScoringItemInput = { hackathonId: string; name: string; maxScore: number };

export const createScoringItem = createServerFn({ method: "POST" })
	.inputValidator((data: CreateScoringItemInput) => data)
	.handler(async (ctx) => {
		const { hackathonId, name, maxScore } = ctx.data;
		const db = getDb(ctx.context!);
		const id = crypto.randomUUID();
		await db.insert(scoring_item).values({
			id,
			name,
			max_score: maxScore,
			hackathon_id: hackathonId,
		});
		return { id };
	});

export const deleteScoringItem = createServerFn({ method: "POST" })
	.inputValidator((id: string) => id)
	.handler(async (ctx) => {
		const db = getDb(ctx.context!);
		await db.delete(scoring_item).where(eq(scoring_item.id, ctx.data));
		return { success: true };
	});

type CheckUaScoredInput = { hackathonId: string; userAgent: string };

export const checkUaScored = createServerFn({ method: "GET" })
	.inputValidator((data: CheckUaScoredInput) => data)
	.handler(async (ctx) => {
		const { hackathonId, userAgent } = ctx.data;
		const db = getDb(ctx.context!);
		const result = await db
			.select({ id: scoring_result.id })
			.from(scoring_result)
			.where(and(eq(scoring_result.hackathon_id, hackathonId), eq(scoring_result.user_agent, userAgent)))
			.limit(1);
		return { scored: result.length > 0 };
	});

type GuestToggleInput = { hackathonId: string; guestId: string; permission?: "view" | "edit" };
type GuestPermissionInput = { hackathonId: string; guestId: string; permission: "view" | "edit" };

export const addGuestToHackathon = createServerFn({ method: "POST" })
	.inputValidator((data: GuestToggleInput) => data)
	.handler(async (ctx) => {
		const db = getDb(ctx.context!);
		await db.insert(hackathon_guest).values({
			hackathon_id: ctx.data.hackathonId,
			guest_id: ctx.data.guestId,
			permission: ctx.data.permission ?? "view",
		});
		return { success: true };
	});

export const updateGuestPermission = createServerFn({ method: "POST" })
	.inputValidator((data: GuestPermissionInput) => data)
	.handler(async (ctx) => {
		const db = getDb(ctx.context!);
		await db
			.update(hackathon_guest)
			.set({ permission: ctx.data.permission })
			.where(
				and(
					eq(hackathon_guest.hackathon_id, ctx.data.hackathonId),
					eq(hackathon_guest.guest_id, ctx.data.guestId),
				),
			);
		return { success: true };
	});

export const removeGuestFromHackathon = createServerFn({ method: "POST" })
	.inputValidator((data: GuestToggleInput) => data)
	.handler(async (ctx) => {
		const db = getDb(ctx.context!);
		await db
			.delete(hackathon_guest)
			.where(
				and(
					eq(hackathon_guest.hackathon_id, ctx.data.hackathonId),
					eq(hackathon_guest.guest_id, ctx.data.guestId),
				),
			);
		return { success: true };
	});
