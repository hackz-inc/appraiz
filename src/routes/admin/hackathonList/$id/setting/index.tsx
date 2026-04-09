import { createFileRoute, Link } from "@tanstack/react-router";
import { HandshakeIcon, NotebookPenIcon, UsersIcon } from "lucide-react";
import { z } from "zod";
import Header from "#/components/Header";
import { ScoringItemForm } from "#/components/ScoringItemForm";
import { TeamForm } from "#/components/TeamForm";
import { adminBeforeLoad } from "#/routes/admin/-beforeLoad";
import { fetchHackathonById } from "../../-functions/hackathon";

const searchSchema = z.object({
	tab: z.enum(["team", "score", "guest"]).optional().default("team"),
});

export const Route = createFileRoute("/admin/hackathonList/$id/setting/")({
	validateSearch: searchSchema,
	loader: async ({ params }) => {
		const hackathon = await fetchHackathonById({ data: params.id });
		return { hackathon };
	},
	pendingComponent: () => <div className="bg-white">データを読み込み中...</div>,
	beforeLoad: adminBeforeLoad,
	component: HackathonSettingPage,
});

function HackathonSettingPage() {
	const { hackathon } = Route.useLoaderData();
	const { tab } = Route.useSearch();

	const tabs = [
		{ id: "team", label: "チーム一覧", icon: UsersIcon },
		{ id: "score", label: "採点基準一覧", icon: NotebookPenIcon },
		{ id: "guest", label: "共同開催者一覧", icon: HandshakeIcon },
	] as const;

	return (
		<>
			<Header>
				<h1 className="text-3xl font-bold">{hackathon.name}</h1>
			</Header>

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
							<div>
								<TeamForm hackathonId={hackathon.id} />

								{hackathon.team.length === 0 ? (
									<div className="bg-white border border-gray-300 rounded-lg p-12 text-center">
										<p className="text-gray-500">
											チームがまだ登録されていません
										</p>
									</div>
								) : (
									<div className="flex flex-col bg-white border border-gray-300 rounded-lg">
										{hackathon.team.map((team) => (
											<div
												key={team.id}
												className="w-full py-5 px-6 border-b last:border-b-0 border-gray-300 flex items-center justify-between gap-6"
											>
												<div className="flex-1 flex justify-between gap-8 min-w-0">
													<p className="text-base font-bold truncate">
														{team.name}
													</p>
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
												<div className="flex gap-3">
													<button
														type="button"
														className="hover:opacity-70 transition-opacity"
														aria-label="編集する"
													>
														<svg
															width="20"
															height="20"
															viewBox="0 0 24 24"
															fill="none"
															xmlns="http://www.w3.org/2000/svg"
														>
															<path
																d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"
																stroke="#333"
																strokeWidth="2"
																strokeLinecap="round"
																strokeLinejoin="round"
															/>
															<path
																d="M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 9.5-9.5z"
																stroke="#333"
																strokeWidth="2"
																strokeLinecap="round"
																strokeLinejoin="round"
															/>
														</svg>
													</button>
													<button
														type="button"
														className="hover:opacity-70 transition-opacity"
														aria-label="削除する"
													>
														<svg
															width="20"
															height="20"
															viewBox="0 0 24 24"
															fill="none"
															xmlns="http://www.w3.org/2000/svg"
														>
															<path
																d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6"
																stroke="#333"
																strokeWidth="2"
																strokeLinecap="round"
																strokeLinejoin="round"
															/>
														</svg>
													</button>
												</div>
											</div>
										))}
									</div>
								)}
							</div>
						)}

						{tab === "score" && (
							<div>
								<ScoringItemForm hackathonId={hackathon.id} />

								{hackathon.scoring_item.length === 0 ? (
									<div className="bg-white border border-gray-300 rounded-lg p-12 text-center">
										<p className="text-gray-500">
											採点項目がまだ登録されていません
										</p>
									</div>
								) : (
									<div className="flex flex-col bg-white border border-gray-300 rounded-lg">
										{hackathon.scoring_item.map((item) => (
											<div
												key={item.id}
												className="w-full py-5 px-6 border-b last:border-b-0 border-gray-300 flex items-center justify-between gap-6"
											>
												<div className="flex-1 flex justify-between gap-8 min-w-0">
													<p className="text-base font-bold truncate">
														{item.name}
													</p>
													<p className="text-base font-bold">{item.max_score}</p>
												</div>
												<div className="flex gap-3">
													<button
														type="button"
														className="hover:opacity-70 transition-opacity"
														aria-label="編集する"
													>
														<svg
															width="20"
															height="20"
															viewBox="0 0 24 24"
															fill="none"
															xmlns="http://www.w3.org/2000/svg"
														>
															<path
																d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"
																stroke="#333"
																strokeWidth="2"
																strokeLinecap="round"
																strokeLinejoin="round"
															/>
															<path
																d="M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 9.5-9.5z"
																stroke="#333"
																strokeWidth="2"
																strokeLinecap="round"
																strokeLinejoin="round"
															/>
														</svg>
													</button>
													<button
														type="button"
														className="hover:opacity-70 transition-opacity"
														aria-label="削除する"
													>
														<svg
															width="20"
															height="20"
															viewBox="0 0 24 24"
															fill="none"
															xmlns="http://www.w3.org/2000/svg"
														>
															<path
																d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6"
																stroke="#333"
																strokeWidth="2"
																strokeLinecap="round"
																strokeLinejoin="round"
															/>
														</svg>
													</button>
												</div>
											</div>
										))}
									</div>
								)}
							</div>
						)}

						{tab === "guest" && (
							<div className="bg-white border border-gray-300 rounded-lg p-12 text-center">
								<p className="text-gray-500">共同開催者機能は実装予定です</p>
							</div>
						)}
					</div>
				</div>
			</div>
		</>
	);
}
