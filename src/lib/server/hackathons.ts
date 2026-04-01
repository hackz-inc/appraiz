import { createAdminClient } from "@/lib/supabase/admin";
import { unstable_cache } from "next/cache";
import { cache } from "react";

export const fetchHackathons = unstable_cache(
	async () => {
		const supabase = createAdminClient();

		const { data, error } = await supabase
			.from("hackathon")
			.select("*")
			.order("scoring_date", { ascending: false });

		if (error) throw new Error(error.message);
		return data;
	},
	["hackathons-list"], // キャッシュキー
	{
		tags: ["hackathons"], // revalidateTag("hackathons", "default") 用
		revalidate: 3600, // 1時間キャッシュ
	},
);

export const getHackathonById = cache(async (id: string) => {
	const supabase = createAdminClient();
	const { data, error } = await (supabase.from("hackathon") as any)
		.select("*")
		.eq("id", id)
		.single();

	if (error) {
		throw new Error(error.message);
	}

	return data;
});
