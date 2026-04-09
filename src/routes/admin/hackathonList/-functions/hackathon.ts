import { createServerFn } from "@tanstack/react-start";
import type { Database } from "#/lib/supabase/client";
import { getSupabaseServerClient } from "#/lib/supabase/server";

type Hackathon = Database["public"]["Tables"]["hackathon"]["Row"];

export const fetchHackathons = createServerFn({ method: "GET" }).handler(
	async () => {
		const supabase = getSupabaseServerClient();

		const { data, error } = await supabase
			.from("hackathon")
			.select("*")
			.order("created_at", { ascending: false });

		if (error) throw new Error(error.message);
		console.log("Fetched hackathons:", data);

		return data as Hackathon[];
	},
);
