import { redirect } from "@tanstack/react-router";
import { getCurrentUserFn } from "#/lib/auth/server";

export const guestBeforeLoad = async () => {
	const user = await getCurrentUserFn();
	if (!user || user.role !== "guest") {
		throw redirect({ to: "/guest/login" });
	}
};
