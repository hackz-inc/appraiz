import { createFileRoute } from "@tanstack/react-router";
import Header from "#/components/Header";
import type { Database } from "#/lib/supabase/client";
import { createClient } from "#/lib/supabase/client";
import { guestBeforeLoad } from "../../-beforeLoad";
import { GuestHackathonCard } from "./-components/GuestHackathonCard";

type Hackathon = Database["public"]["Tables"]["hackathon"]["Row"];

export const Route = createFileRoute("/guest/hackathonList/$id/")({
	beforeLoad: guestBeforeLoad,
	loader: async ({ params }) => {
		const supabase = createClient();

		// Fetch hackathon details
		const { data: hackathon, error } = await supabase
			.from("hackathon")
			.select("*")
			.eq("id", params.id)
			.single();

		if (error) throw new Error(error.message);

		return { hackathon: hackathon as Hackathon };
	},
	component: GuestHackathonDetailPage,
});

function GuestHackathonDetailPage() {
	const { hackathon } = Route.useLoaderData();

	return (
		<>
			<Header
				breadcrumbItems={[
					{ name: "ハッカソン一覧", href: "/guest/hackathonList" },
					{ name: hackathon.name },
				]}
			/>
			<div className="min-h-screen bg-gray-50 p-8 pb-20">
				<div className="max-w-5xl mx-auto">
					<GuestHackathonCard hackathon={hackathon} />
				</div>
			</div>
		</>
	);
}
