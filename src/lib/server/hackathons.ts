import { createAdminClient } from "@/lib/supabase/admin"; // さっき作ったやつ
import { unstable_cache } from "next/cache";
import { cache } from "react";

const fetchHackathons = unstable_cache(
	async () => {
		// cookies() を使わないので、unstable_cache の中で呼んでも怒られません
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

// コンポーネントからはこちらを呼ぶ
export const getHackathons = cache(async () => {
	return await fetchHackathons();
});

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
