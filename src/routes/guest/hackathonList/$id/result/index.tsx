import { createFileRoute } from "@tanstack/react-router";
import Header from "#/components/Header";
import type { Database } from "#/lib/supabase/client";
import { createClient } from "#/lib/supabase/client";
import { guestBeforeLoad } from "../../../-beforeLoad";

type Hackathon = Database["public"]["Tables"]["hackathon"]["Row"];

export const Route = createFileRoute("/guest/hackathonList/$id/result/")({
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
	component: GuestHackathonResultPage,
});

function GuestHackathonResultPage() {
	const { hackathon } = Route.useLoaderData();

	return (
		<>
			<Header
				breadcrumbItems={[
					{ name: "ハッカソン一覧", href: "/guest/hackathonList" },
					{ name: hackathon.name, href: `/guest/hackathonList/${hackathon.id}` },
					{ name: "結果" },
				]}
			/>
			<div className="min-h-screen bg-gray-50 p-8">
				<div className="max-w-5xl mx-auto">
					<div className="bg-white rounded-lg shadow-md p-8">
						<h1 className="text-2xl font-bold mb-4">{hackathon.name} - 結果</h1>
						<p className="text-gray-600">結果ページは現在開発中です。</p>
					</div>
				</div>
			</div>
		</>
	);
}
