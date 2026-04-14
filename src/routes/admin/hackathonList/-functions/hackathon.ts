import { createServerFn } from "@tanstack/react-start";
import type { Database } from "#/lib/supabase/client";
import { getSupabaseServerClient } from "#/lib/supabase/server";

type Hackathon = Database["public"]["Tables"]["hackathon"]["Row"];
type Team = Database["public"]["Tables"]["team"]["Row"];
type ScoringItem = Database["public"]["Tables"]["scoring_item"]["Row"];
type Guest = Database["public"]["Tables"]["guest"]["Row"];
type HackathonGuest = Database["public"]["Tables"]["hackathon_guest"]["Row"];

type HackathonWithDetails = Hackathon & {
	team: Team[];
	scoring_item: ScoringItem[];
	hackathon_guest: (HackathonGuest & { guest: Guest })[];
};

export const fetchHackathons = createServerFn({ method: "GET" }).handler(
	async () => {
		const supabase = getSupabaseServerClient();

		const { data, error } = await supabase
			.from("hackathon")
			.select("*")
			.order("created_at", { ascending: false });

		if (error) throw new Error(error.message);

		return data as Hackathon[];
	},
);

export const fetchAllGuests = createServerFn({ method: "GET" }).handler(
	async () => {
		const supabase = getSupabaseServerClient();

		const { data, error } = await supabase
			.from("guest")
			.select("*")
			.order("created_at", { ascending: false });

		if (error) throw new Error(error.message);

		return data as Guest[];
	},
);

export const fetchHackathonById = createServerFn({
	method: "GET",
}).handler(async (ctx) => {
	const id = (ctx.data ?? "") as string;
	const supabase = getSupabaseServerClient();

	const { data, error } = await supabase
		.from("hackathon")
		.select(`
			*,
			team (*),
			scoring_item (*),
			hackathon_guest (*, guest (*))
		`)
		.eq("id", id)
		.single();

	if (error) throw new Error(error.message);

	return data as HackathonWithDetails;
});

export const addGuestToHackathon = createServerFn({
	method: "POST",
}).handler(async (ctx) => {
	const data = (ctx.data ?? {
		hackathonId: "",
		guestId: "",
	}) as { hackathonId: string; guestId: string };
	const supabase = getSupabaseServerClient();

	const { error } = await supabase.from("hackathon_guest").insert({
		hackathon_id: data.hackathonId,
		guest_id: data.guestId,
	});

	if (error) throw new Error(error.message);

	return { success: true };
});

export const removeGuestFromHackathon = createServerFn({
	method: "POST",
}).handler(async (ctx) => {
	const data = (ctx.data ?? {
		hackathonId: "",
		guestId: "",
	}) as { hackathonId: string; guestId: string };
	const supabase = getSupabaseServerClient();

	const { error } = await supabase
		.from("hackathon_guest")
		.delete()
		.eq("hackathon_id", data.hackathonId)
		.eq("guest_id", data.guestId);

	if (error) throw new Error(error.message);

	return { success: true };
});
