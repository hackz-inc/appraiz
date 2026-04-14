import { createFileRoute, Link } from "@tanstack/react-router";
import { HandshakeIcon, NotebookPenIcon, UsersIcon } from "lucide-react";
import { z } from "zod";
import Header from "#/components/Header";
import { adminBeforeLoad } from "#/routes/admin/-beforeLoad";
import { getSupabaseServerClient } from "#/lib/supabase/server";
import type { Database } from "#/lib/supabase/client";
import { GuestList } from "./-components/GuestList";
import { ScoringItemList } from "./-components/ScoringItemList";
import { TeamList } from "./-components/TeamList";

type Hackathon = Database["public"]["Tables"]["hackathon"]["Row"];
type Team = Database["public"]["Tables"]["team"]["Row"];
type ScoringItem = Database["public"]["Tables"]["scoring_item"]["Row"];
type Guest = Database["public"]["Tables"]["guest"]["Row"];
type HackathonGuest = Database["public"]["Tables"]["hackathon_guest"]["Row"];

type HackathonWithDetails = Hackathon & {
	team: Team[];
	scoring_item: ScoringItem[];
	hackathon_guest: (HackathonGuest & { guest: Guest })[];
};

const searchSchema = z.object({
	tab: z.enum(["team", "score", "guest"]).optional().default("team"),
});

export const Route = createFileRoute("/admin/hackathonList/$id/setting/")({
	validateSearch: searchSchema,
	loader: async ({ params }) => {
		const supabase = getSupabaseServerClient();

		// Fetch hackathon with details
		const { data: hackathon, error: hackathonError } = await supabase
			.from("hackathon")
			.select(`
				*,
				team (*),
				scoring_item (*),
				hackathon_guest (*, guest (*))
			`)
			.eq("id", params.id)
			.single();

		if (hackathonError) throw new Error(hackathonError.message);

		// Fetch all guests
		const { data: allGuests, error: guestsError } = await supabase
			.from("guest")
			.select("*")
			.order("created_at", { ascending: false });

		if (guestsError) throw new Error(guestsError.message);

		return {
			hackathon: hackathon as HackathonWithDetails,
			allGuests: allGuests as Guest[]
		};
	},
	pendingComponent: () => <div className="bg-white">データを読み込み中...</div>,
	beforeLoad: adminBeforeLoad,
	component: HackathonSettingPage,
});

function HackathonSettingPage() {
	const { hackathon, allGuests } = Route.useLoaderData();
	const { tab } = Route.useSearch();

	const tabs = [
		{ id: "team", label: "チーム一覧", icon: UsersIcon },
		{ id: "score", label: "採点基準一覧", icon: NotebookPenIcon },
		{ id: "guest", label: "共同開催者一覧", icon: HandshakeIcon },
	] as const;

	const getTabName = () => {
		const currentTab = tabs.find((t) => t.id === tab);
		return currentTab?.label || "チーム一覧";
	};

	return (
		<>
			<Header
				breadcrumbItems={[
					{ name: "ハッカソン一覧", path: "/admin/hackathonList" },
					{ name: hackathon.name },
					{ name: getTabName() },
				]}
			/>

			<div className="min-h-screen bg-gray-50">
				<div className="max-w-5xl mx-auto px-8 py-8">
					{/* タブナビゲーション */}
					<div className="mb-8">
						<div className="border-b border-gray-300">
							<nav className="flex gap-8">
								{tabs.map((tabItem) => {
									const Icon = tabItem.icon;
									const isActive = tab === tabItem.id;
									return (
										<Link
											key={tabItem.id}
											to="/admin/hackathonList/$id/setting"
											params={{ id: hackathon.id }}
											search={{ tab: tabItem.id }}
											className={`
												flex items-center gap-2 px-4 py-3 border-b-2 font-bold text-base
												transition-colors
												${
													isActive
														? "border-yellow-500 text-black"
														: "border-transparent text-gray-500 hover:text-gray-700"
												}
											`}
										>
											<Icon size={20} />
											<span>{tabItem.label}</span>
										</Link>
									);
								})}
							</nav>
						</div>
					</div>

					{/* タブコンテンツ */}
					<div>
						{tab === "team" && (
							<TeamList hackathonId={hackathon.id} teams={hackathon.team} />
						)}

						{tab === "score" && (
							<ScoringItemList
								hackathonId={hackathon.id}
								scoringItems={hackathon.scoring_item}
							/>
						)}

						{tab === "guest" && (
							<GuestList
								hackathonId={hackathon.id}
								guests={allGuests.map((guest) => ({
									...guest,
									is_invited: hackathon.hackathon_guest.some(
										(hg) => hg.guest_id === guest.id,
									),
								}))}
							/>
						)}
					</div>
				</div>
			</div>
		</>
	);
}
