import { createClient } from "@/lib/supabase/client";

export type Guest = {
	id: string;
	name: string;
	company_name: string;
	email: string;
	created_at: string;
	updated_at: string;
}

export type GuestWithInviteStatus = Guest & {
	isInvited: boolean;
}

export const guests = {
	async getAll(): Promise<Guest[]> {
		const supabase = createClient();
		const { data, error } = await (supabase.from("guest") as any)
			.select("*")
			.order("created_at", { ascending: false });

		if (error) {
			throw new Error(error.message);
		}

		return data as Guest[];
	},

	async getAllWithInviteStatus(
		hackathonId: string,
	): Promise<GuestWithInviteStatus[]> {
		const supabase = createClient();

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
	},

	async updateInvitedGuests(
		hackathonId: string,
		guestIds: string[],
	): Promise<void> {
		const supabase = createClient();

		// First, delete all existing invitations for this hackathon
		const { error: deleteError } = await (
			supabase.from("hackathon_guest") as any
		)
			.delete()
			.eq("hackathon_id", hackathonId);

		if (deleteError) {
			throw new Error(deleteError.message);
		}

		// Then, insert new invitations
		if (guestIds.length > 0) {
			const invitations = guestIds.map((guestId) => ({
				hackathon_id: hackathonId,
				guest_id: guestId,
			}));

			const { error: insertError } = await (
				supabase.from("hackathon_guest") as any
			).insert(invitations);

			if (insertError) {
				throw new Error(insertError.message);
			}
		}
	},
};
