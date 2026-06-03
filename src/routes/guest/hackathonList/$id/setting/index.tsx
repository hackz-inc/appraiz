import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { NotebookPenIcon, UsersIcon } from "lucide-react";
import { z } from "zod";
import Header from "#/components/Header";
import { TeamForm } from "#/components/TeamForm";
import { ScoringItemForm } from "#/components/ScoringItemForm";
import {
	deleteTeam,
	deleteScoringItem,
} from "#/routes/admin/hackathonList/-functions/hackathon";
import { guestBeforeLoad } from "../../../-beforeLoad";
import { fetchGuestHackathonSetting } from "../../../-functions/hackathon";

const searchSchema = z.object({
	tab: z.enum(["team", "score"]).optional().default("team"),
});

export const Route = createFileRoute("/guest/hackathonList/$id/setting/")({
	validateSearch: searchSchema,
	beforeLoad: guestBeforeLoad,
	loader: async ({ params }) => {
		const data = await fetchGuestHackathonSetting({
			data: { hackathonId: params.id },
		});
		if (data.permission !== "edit") {
			throw redirect({ to: "/guest/hackathonList" });
		}
		return data;
	},
	pendingComponent: () => <div className="bg-white">データを読み込み中...</div>,
	component: GuestSettingPage,
});

function GuestSettingPage() {
	const { hackathon } = Route.useLoaderData();
	const { tab } = Route.useSearch();

	const tabs = [
		{ id: "team", label: "チーム一覧", icon: UsersIcon },
		{ id: "score", label: "採点基準一覧", icon: NotebookPenIcon },
	] as const;

	const getTabName = () => {
		const currentTab = tabs.find((t) => t.id === tab);
		return currentTab?.label || "チーム一覧";
	};

	return (
		<>
			<Header
				breadcrumbItems={[
					{ name: "ハッカソン一覧", path: "/guest/hackathonList" },
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
											to="/guest/hackathonList/$id/setting"
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
							<>
								<div className="mb-4">
									<TeamForm hackathonId={hackathon.id} />
								</div>
								{hackathon.teams.length === 0 ? (
									<div className="bg-white border border-gray-300 rounded-lg p-12 text-center">
										<p className="text-gray-500">チームがまだ登録されていません</p>
									</div>
								) : (
									<TeamList teams={hackathon.teams} />
								)}
							</>
						)}

						{tab === "score" && (
							<>
								<div className="mb-4">
									<ScoringItemForm hackathonId={hackathon.id} />
								</div>
								{hackathon.scoring_items.length === 0 ? (
									<div className="bg-white border border-gray-300 rounded-lg p-12 text-center">
										<p className="text-gray-500">採点項目がまだ登録されていません</p>
									</div>
								) : (
									<ScoringItemList items={hackathon.scoring_items} />
								)}
							</>
						)}
					</div>
				</div>
			</div>
		</>
	);
}

function TeamList({
	teams,
}: {
	teams: { id: string; name: string; topaz_link: string | null }[];
}) {
	const [deletingId, setDeletingId] = useState<string | null>(null);

	const handleDelete = async (id: string, name: string) => {
		if (!window.confirm(`「${name}」を削除してもよろしいですか？`)) return;
		setDeletingId(id);
		try {
			await deleteTeam({ data: id });
			window.location.reload();
		} catch {
			alert("削除に失敗しました");
			setDeletingId(null);
		}
	};

	return (
		<div className="flex flex-col bg-white border border-gray-300 rounded-lg">
			{teams.map((team, i) => (
				<div
					key={team.id}
					className={`w-full py-5 px-6 flex items-center justify-between gap-6 ${
						i !== teams.length - 1 ? "border-b border-gray-300" : ""
					}`}
				>
					<div className="flex-1 flex justify-between gap-8 min-w-0">
						<p className="text-base font-bold truncate">{team.name}</p>
						{team.topaz_link && (
							<a
								href={team.topaz_link}
								target="_blank"
								rel="noreferrer"
								className="text-base font-bold text-blue-600 hover:text-blue-800 truncate max-w-[300px]"
							>
								{team.topaz_link}
							</a>
						)}
					</div>
					<button
						type="button"
						onClick={() => handleDelete(team.id, team.name)}
						disabled={deletingId === team.id}
						className="hover:opacity-70 transition-opacity disabled:opacity-30"
						aria-label="削除する"
					>
						<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
						</svg>
					</button>
				</div>
			))}
		</div>
	);
}

function ScoringItemList({
	items,
}: {
	items: { id: string; name: string; max_score: number }[];
}) {
	const [deletingId, setDeletingId] = useState<string | null>(null);

	const handleDelete = async (id: string, name: string) => {
		if (!window.confirm(`「${name}」を削除してもよろしいですか？`)) return;
		setDeletingId(id);
		try {
			await deleteScoringItem({ data: id });
			window.location.reload();
		} catch {
			alert("削除に失敗しました");
			setDeletingId(null);
		}
	};

	return (
		<div className="flex flex-col bg-white border border-gray-300 rounded-lg">
			{items.map((item, i) => (
				<div
					key={item.id}
					className={`w-full py-5 px-6 flex items-center justify-between gap-6 ${
						i !== items.length - 1 ? "border-b border-gray-300" : ""
					}`}
				>
					<div className="flex-1 flex justify-between gap-8 min-w-0">
						<p className="text-base font-bold truncate">{item.name}</p>
						<p className="text-base font-bold">{item.max_score}</p>
					</div>
					<button
						type="button"
						onClick={() => handleDelete(item.id, item.name)}
						disabled={deletingId === item.id}
						className="hover:opacity-70 transition-opacity disabled:opacity-30"
						aria-label="削除する"
					>
						<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
						</svg>
					</button>
				</div>
			))}
		</div>
	);
}
