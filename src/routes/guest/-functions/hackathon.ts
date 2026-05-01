import { createServerFn } from "@tanstack/react-start";
import type { Database } from "#/lib/supabase/client";
import { getSupabaseServerClient } from "#/lib/supabase/server";

type Hackathon = Database["public"]["Tables"]["hackathon"]["Row"];

export const fetchGuestHackathons = createServerFn({ method: "GET" }).handler(
	async () => {
		const supabase = getSupabaseServerClient();

		// Get current user
		const { data: userData, error: userError } = await supabase.auth.getUser();

		if (userError || !userData.user?.email) {
			throw new Error("User not authenticated");
		}

		// Get guest ID from email
		const { data: guest, error: guestError } = await supabase
			.from("guest")
			.select("id")
			.eq("email", userData.user.email)
			.single();

		if (guestError) throw new Error(guestError.message);

		// Get hackathons where guest is invited
		const { data, error } = await supabase
			.from("hackathon_guest")
			.select("hackathon (*)")
			.eq("guest_id", guest.id);

		if (error) throw new Error(error.message);

		// Extract hackathon objects from the nested structure
		const hackathons = data
			.map((item) => item.hackathon)
			.filter((h): h is Hackathon => h !== null);

		return hackathons;
	},
);
