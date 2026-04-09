import { createFileRoute, redirect } from "@tanstack/react-router";
import { adminBeforeLoad } from "./-beforeLoad";

export const Route = createFileRoute("/admin/")({
	beforeLoad: async () => {
		await adminBeforeLoad();

		throw redirect({
			to: "/admin/hackathonList",
			replace: true,
		});
	},
});
