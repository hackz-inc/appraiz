import { redirect } from "@tanstack/react-router";
import { getSupabaseServerClient } from "#/lib/supabase/server";

export const guestBeforeLoad = async () => {
	const supabase = getSupabaseServerClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		throw redirect({
			to: "/guest/login",
		});
	}

	// ゲストテーブルにユーザーが存在するか確認
	const { data: guest, error } = await supabase
		.from("guest")
		.select("*")
		.eq("id", user.id)
		.single();

	if (error || !guest) {
		throw redirect({
			to: "/guest/login",
		});
	}

	return { user, guest };
};
