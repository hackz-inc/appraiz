import { createFileRoute, Link } from "@tanstack/react-router";
import { HandshakeIcon, NotebookPenIcon, UsersIcon } from "lucide-react";
import { z } from "zod";
import Header from "#/components/Header";
import type { SafeGuest } from "#/lib/db/types";
import { adminBeforeLoad } from "#/routes/admin/-beforeLoad";
import { fetchAllGuests, fetchHackathonById } from "../../-functions/hackathon";
import { GuestList } from "./-components/GuestList";
import { ScoringItemList } from "./-components/ScoringItemList";
import { TeamList } from "./-components/TeamList";

const searchSchema = z.object({
	tab: z.enum(["team", "score", "guest"]).optional().default("team"),
});

export const Route = createFileRoute("/admin/hackathonList/$id/setting/")({
	head: ({ loaderData }) => ({
		meta: [{ title: `${loaderData?.hackathon.name} - 設定 | Apprai'z` }],
	}),
	validateSearch: searchSchema,
	loader: async ({ params }) => {
		const [hackathon, allGuests] = await Promise.all([
			fetchHackathonById({ data: params.id }),
			fetchAllGuests(),
		]);
		return { hackathon, allGuests };
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
														? "border-brand-yellow text-black"
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

					<div>
						{tab === "team" && (
							<TeamList hackathonId={hackathon.id} teams={hackathon.teams} />
						)}

						{tab === "score" && (
							<ScoringItemList
								hackathonId={hackathon.id}
								scoringItems={hackathon.scoring_items}
							/>
						)}

						{tab === "guest" && (
							<GuestList
								hackathonId={hackathon.id}
								guests={(allGuests as SafeGuest[]).map((g) => {
									const hg = hackathon.hackathon_guests.find(
										(hg: { guest_id: string; permission?: string }) =>
											hg.guest_id === g.id,
									);
									return {
										...g,
										is_invited: !!hg,
										permission: (hg?.permission ?? "view") as "view" | "edit",
									};
								})}
							/>
						)}
					</div>
				</div>
			</div>
		</>
	);
}
