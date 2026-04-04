"use server";

import { createClient } from "@/lib/supabase/server";
import { unstable_cache } from "next/cache";
import { cache } from "react";
import { createAdminClient } from "../supabase/admin";

export type Guest = {
	id: string;
	name: string;
	company_name: string;
	email: string;
	created_at: string;
	updated_at: string;
};

export type GuestWithInviteStatus = Guest & {
	isInvited: boolean;
};

export const fetchGuests = unstable_cache(
	async () => {
		const supabase = createAdminClient();

		const { data, error } = await supabase
			.from("guest")
			.select("*")
			.order("created_at", { ascending: false });

		if (error) throw new Error(error.message);
		return data;
	},
	["guests-list"],
	{
		tags: ["guests"],
		revalidate: 3600,
	},
);

export const getGuests = cache(async () => {
	const supabase = await createClient();
	const { data, error } = await (supabase.from("guest") as any)
		.select("*")
		.order("created_at", { ascending: false });

	if (error) {
		throw new Error(error.message);
	}

	return data as Guest[];
});

export const getGuestsWithInviteStatus = cache(async (hackathonId: string) => {
	const supabase = await createClient();

	// Get all guests
	const { data: allGuests, error: guestsError } = await (
		supabase.from("guest") as any
	)
		.select("*")
		.order("created_at", { ascending: false });

	if (guestsError) {
		throw new Error(guestsError.message);
	}

	// Get invited guests for this hackathon
	const { data: invitedGuests, error: invitedError } = await (
		supabase.from("hackathon_guest") as any
	)
		.select("guest_id")
		.eq("hackathon_id", hackathonId);

	if (invitedError) {
		throw new Error(invitedError.message);
	}

	const invitedGuestIds = new Set(
		invitedGuests?.map((g: any) => g.guest_id) || [],
	);

	const guestsWithStatus: GuestWithInviteStatus[] = allGuests.map(
		(guest: Guest) => ({
			...guest,
			isInvited: invitedGuestIds.has(guest.id),
		}),
	);

	return guestsWithStatus;
});

export const getInvitedGuests = cache(async (hackathonId: string) => {
	const supabase = await createClient();

	const { data, error } = await (supabase.from("hackathon_guest") as any)
		.select(`
      guest_id,
      guest:guest_id (
        id,
        name,
        company_name,
        email,
        created_at,
        updated_at
      )
    `)
		.eq("hackathon_id", hackathonId);

	if (error) {
		throw new Error(error.message);
	}

	return (data?.map((item: any) => item.guest) as Guest[]) || [];
});
