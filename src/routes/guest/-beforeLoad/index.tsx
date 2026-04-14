import { redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getSupabaseServerClient } from "#/lib/supabase/server";

const fetchUser = createServerFn({ method: "GET" }).handler(async () => {
	const supabase = getSupabaseServerClient();
	const { data, error: _error } = await supabase.auth.getUser();

	if (!data.user?.email) {
		return null;
	}

	// Check if user has guest role
	const userRole = data.user.user_metadata?.role;
	if (userRole !== "guest") {
		return null;
	}

	return {
		data,
	};
});

export const guestBeforeLoad = async () => {
	const user = await fetchUser();
	if (!user) {
		throw redirect({
			to: `/guest/login`,
		});
	}
};
