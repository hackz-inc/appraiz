import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import type { Database } from "#/lib/supabase/client";
import { createClient } from "#/lib/supabase/client";
import { ScoringForm } from "./-components/ScoringForm";

type Hackathon = Database["public"]["Tables"]["hackathon"]["Row"];
type Team = Database["public"]["Tables"]["team"]["Row"];
type ScoringItem = Database["public"]["Tables"]["scoring_item"]["Row"];

type TeamWithOrder = Team & {
	order: number;
};

type HackathonWithDetails = Hackathon & {
	teams: TeamWithOrder[];
	scoring_items: ScoringItem[];
};

export const Route = createFileRoute("/scorer/$hackathonId/")({
	loader: async ({ params }) => {
		const supabase = createClient();

		// Fetch hackathon
		const { data: hackathon, error: hackathonError } = await supabase
			.from("hackathon")
			.select("*")
			.eq("id", params.hackathonId)
			.single();

		if (hackathonError) throw new Error(hackathonError.message);

		// Fetch teams
		const { data: teams, error: teamsError } = await supabase
			.from("team")
			.select("*")
			.eq("hackathon_id", params.hackathonId);

		if (teamsError) throw new Error(teamsError.message);

		// Fetch presentation orders
		const { data: orders, error: ordersError } = await supabase
			.from("presentation_order")
			.select("*")
			.in(
				"team_id",
				teams.map((t) => t.id),
			);

		if (ordersError) throw new Error(ordersError.message);

		// Merge teams with orders
		const teamsWithOrder = teams
			.map((team) => {
				const order = orders?.find((o) => o.team_id === team.id);
				return {
					...team,
					order: order?.order ?? 0,
				};
			})
			.sort((a, b) => a.order - b.order);

		// Fetch scoring items
		const { data: scoringItems, error: scoringItemsError } = await supabase
			.from("scoring_item")
			.select("*")
			.eq("hackathon_id", params.hackathonId)
			.order("created_at", { ascending: true });

		if (scoringItemsError) throw new Error(scoringItemsError.message);

		return {
			hackathon: {
				...hackathon,
				teams: teamsWithOrder,
				scoring_items: scoringItems,
			} as HackathonWithDetails,
		};
	},
	pendingComponent: () => <div className="bg-white">データを読み込み中...</div>,
	component: ScorerPage,
});

function ScorerPage() {
	const { hackathon } = Route.useLoaderData();
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	return (
		<div className="min-h-screen bg-white">
			{/* Header */}
			<header className="bg-white border-b border-gray-200 sticky top-0 z-10">
				<div className="max-w-[800px] mx-auto px-4 py-4">
					<div className="flex items-center justify-between">
						<h1 className="text-2xl font-bold text-gray-900">
							{hackathon.name}
						</h1>
						<button
							type="button"
							onClick={() => setIsMenuOpen(!isMenuOpen)}
							className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
						>
							{isMenuOpen ? "メニューを閉じる" : "メニューを開く"}
						</button>
					</div>
				</div>
			</header>

			<div className="flex">
				{/* Side Menu */}
				{isMenuOpen && (
					<aside className="w-64 bg-white border-r border-gray-200 p-4 h-screen sticky top-16 overflow-y-auto">
						<h2 className="text-lg font-bold text-gray-900 mb-4">チーム一覧</h2>
						<nav className="space-y-2">
							{hackathon.teams.map((team) => (
								<a
									key={team.id}
									href={`#${team.id}`}
									className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
								>
									No.{team.order} : {team.name}
								</a>
							))}
						</nav>
					</aside>
				)}

				{/* Main Content */}
				<main className="flex-1">
					<ScoringForm hackathon={hackathon} />
				</main>
			</div>
		</div>
	);
}
