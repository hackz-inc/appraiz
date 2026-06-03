import { createServerFn } from "@tanstack/react-start";
import { and, eq } from "drizzle-orm";
import { getCurrentUserFn } from "#/lib/auth/server";
import { getDb } from "#/lib/db/client";
import { guest, hackathon, hackathon_guest } from "#/lib/db/schema";
import "#/types/cloudflare";
import type { Hackathon } from "#/lib/db/types";

export type GuestHackathon = Hackathon & { permission: "view" | "edit" };

export const fetchGuestHackathons = createServerFn({ method: "GET" }).handler(
	async (ctx) => {
		const session = await getCurrentUserFn();
		if (!session?.email) throw new Error("User not authenticated");

		const db = getDb(ctx.context!);

		const guestRecord = await db
			.select({ id: guest.id })
			.from(guest)
			.where(eq(guest.email, session.email))
			.get();

		if (!guestRecord) throw new Error("Guest not found");

		const relations = await db.query.hackathon_guest.findMany({
			where: eq(hackathon_guest.guest_id, guestRecord.id),
			with: { hackathon: true },
		});

		return relations
			.filter((r) => r.hackathon != null)
			.map((r) => ({
				...(r.hackathon as Hackathon),
				permission: (r.permission ?? "view") as "view" | "edit",
			})) satisfies GuestHackathon[];
	},
);

type FetchGuestSettingInput = { hackathonId: string };

export const fetchGuestHackathonSetting = createServerFn({ method: "GET" })
	.inputValidator((data: FetchGuestSettingInput) => data)
	.handler(async (ctx) => {
		const { hackathonId } = ctx.data;
		const session = await getCurrentUserFn();
		if (!session?.email) throw new Error("User not authenticated");

		const db = getDb(ctx.context!);

		const guestRecord = await db
			.select({ id: guest.id })
			.from(guest)
			.where(eq(guest.email, session.email))
			.get();

		if (!guestRecord) throw new Error("Guest not found");

		const relation = await db
			.select({ permission: hackathon_guest.permission })
			.from(hackathon_guest)
			.where(
				and(
					eq(hackathon_guest.hackathon_id, hackathonId),
					eq(hackathon_guest.guest_id, guestRecord.id),
				),
			)
			.get();

		if (!relation) throw new Error("Not invited to this hackathon");

		const hackathonData = await db.query.hackathon.findFirst({
			where: eq(hackathon.id, hackathonId),
			with: {
				teams: true,
				scoring_items: true,
			},
		});

		if (!hackathonData) throw new Error("Hackathon not found");

		return {
			hackathon: hackathonData,
			permission: (relation.permission ?? "view") as "view" | "edit",
		};
	});
