import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import type { Database } from "#/lib/supabase/client";
import { createClient } from "#/lib/supabase/client";
import { ScoringForm } from "./-components/ScoringForm";

type Hackathon = Database["public"]["Tables"]["hackathon"]["Row"];
type Team = Database["public"]["Tables"]["team"]["Row"];
type ScoringItem = Database["public"]["Tables"]["scoring_item"]["Row"];
type PresentationOrder =
	Database["public"]["Tables"]["presentation_order"]["Row"];

type TeamWithOrder = Team & {
	order: number;
};

type HackathonWithDetails = Hackathon & {
	teams: TeamWithOrder[];
	scoring_items: ScoringItem[];
};

type HackathonWithRelations = Hackathon & {
	teams: (Team & {
		presentation_order: PresentationOrder[];
	})[];
	scoring_items: ScoringItem[];
};

export const Route = createFileRoute("/scorer/$hackathonId/")({
	loader: async ({ params }) => {
		const supabase = createClient();

		// Fetch hackathon with teams and scoring items in one query
		const { data: hackathon, error: hackathonError } = await supabase
			.from("hackathon")
			.select(`
				*,
				teams:team(
					*,
					presentation_order(order)
				),
				scoring_items:scoring_item(*)
			`)
			.eq("id", params.hackathonId)
			.single();

		if (hackathonError) throw new Error(hackathonError.message);

		const hackathonWithRelations =
			hackathon as unknown as HackathonWithRelations;

		// Sort teams by presentation order and flatten the structure
		const teamsWithOrder = (hackathonWithRelations.teams || [])
			.map((team) => ({
				...team,
				order: team.presentation_order?.[0]?.order ?? 0,
			}))
			.sort((a, b) => a.order - b.order);

		// Sort scoring items by created_at
		const sortedScoringItems = (
			hackathonWithRelations.scoring_items || []
		).sort(
			(a, b) =>
				new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
		);

		console.info("scoringItems", sortedScoringItems);

		return {
			hackathon: {
				...hackathonWithRelations,
				teams: teamsWithOrder,
				scoring_items: sortedScoringItems,
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
