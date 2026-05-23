import { createServerFn } from "@tanstack/react-start";
import { and, desc, eq } from "drizzle-orm";
import { getDb } from "#/lib/db/client";
import { guest, hackathon, hackathon_guest } from "#/lib/db/schema";
import type { Hackathon, SafeGuest } from "#/lib/db/types";

export const fetchHackathons = createServerFn({ method: "GET" }).handler(
	async () => {
		const db = getDb();
		const data = await db
			.select()
			.from(hackathon)
			.orderBy(desc(hackathon.created_at));
		return data as Hackathon[];
	},
);

export const fetchAllGuests = createServerFn({ method: "GET" }).handler(
	async () => {
		const db = getDb();
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
		const db = getDb();

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

type GuestToggleInput = { hackathonId: string; guestId: string };

export const addGuestToHackathon = createServerFn({ method: "POST" })
	.inputValidator((data: GuestToggleInput) => data)
	.handler(async (ctx) => {
		const data = ctx.data;
		const db = getDb();
		await db.insert(hackathon_guest).values({
			hackathon_id: data.hackathonId,
			guest_id: data.guestId,
		});
		return { success: true };
	});

export const removeGuestFromHackathon = createServerFn({ method: "POST" })
	.inputValidator((data: GuestToggleInput) => data)
	.handler(async (ctx) => {
		const data = ctx.data;
		const db = getDb();
		await db
			.delete(hackathon_guest)
			.where(
				and(
					eq(hackathon_guest.hackathon_id, data.hackathonId),
					eq(hackathon_guest.guest_id, data.guestId),
				),
			);
		return { success: true };
	});
