import { redirect } from "@tanstack/react-router";
import { getCurrentUserFn } from "#/lib/auth/server";

export const adminBeforeLoad = async () => {
	const user = await getCurrentUserFn();
	if (!user || user.role !== "admin") {
		throw redirect({ to: "/admin/auth/login" });
	}
};
