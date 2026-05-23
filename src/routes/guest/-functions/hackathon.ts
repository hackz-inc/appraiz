import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { getCurrentUserFn } from "#/lib/auth/server";
import { getDb } from "#/lib/db/client";
import { guest, hackathon_guest } from "#/lib/db/schema";
import type { Hackathon } from "#/lib/db/types";

export const fetchGuestHackathons = createServerFn({ method: "GET" }).handler(
	async () => {
		const session = await getCurrentUserFn();
		if (!session?.email) throw new Error("User not authenticated");

		const db = getDb();

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
			.map((r) => r.hackathon)
			.filter(Boolean) as Hackathon[];
	},
);
