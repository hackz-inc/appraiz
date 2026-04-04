"use server";

import { guests } from "@/lib/guests";
import { revalidatePath } from "next/cache";

export async function updateInvitedGuestsAction(
	hackathonId: string,
	guestIds: string[],
) {
	try {
		await guests.updateInvitedGuests(hackathonId, guestIds);
		revalidatePath("/admin");
		return { success: true };
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
}
