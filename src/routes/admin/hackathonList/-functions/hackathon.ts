import { createServerFn } from "@tanstack/react-start";
import type { Database } from "#/lib/supabase/client";
import { getSupabaseServerClient } from "#/lib/supabase/server";

type Hackathon = Database["public"]["Tables"]["hackathon"]["Row"];

export const fetchHackathons = createServerFn({ method: "GET" }).handler(
	async () => {
		const supabase = getSupabaseServerClient();

		// await new Promise((r) => setTimeout(r, 3000));

		const { data, error } = await supabase
			.from("hackathon")
			.select("*")
			.order("created_at", { ascending: false });

		if (error) throw new Error(error.message);

		return data as Hackathon[];
	},
);

export const fetchHackathonById = createServerFn({ method: "GET" }).handler(
	async ({ data: id }) => {
		// await new Promise((r) => setTimeout(r, 10000));
		const supabase = getSupabaseServerClient();

		const { data, error } = await supabase
			.from("hackathon")
			.select(`
				*,
				team (*),
				scoring_item (*)
			`)
			.eq("id", id)
			.single();

		if (error) throw new Error(error.message);

		return data as Hackathon;
	},
);
