import { redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getSupabaseServerClient } from "#/lib/supabase/server";

const fetchUser = createServerFn({ method: "GET" }).handler(async () => {
	const supabase = getSupabaseServerClient();
	const { data, error: _error } = await supabase.auth.getUser();

	if (!data.user?.email) {
		return null;
	}

	return {
		data,
	};
});

export const adminBeforeLoad = async () => {
	const user = await fetchUser();
	if (!user) {
		throw redirect({
			to: `/admin/auth/login`,
		});
	}
};
