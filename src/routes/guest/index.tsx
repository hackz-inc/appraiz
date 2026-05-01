import { createFileRoute, redirect } from "@tanstack/react-router";
import { guestBeforeLoad } from "./-beforeLoad";

export const Route = createFileRoute("/guest/")({
	beforeLoad: async () => {
		await guestBeforeLoad();
		throw redirect({
			to: "/guest/hackathonList",
		})
	},
});
