import { createFileRoute } from "@tanstack/react-router";
import { NotebookPenIcon, UsersIcon } from "lucide-react";
import Header from "#/components/Header";
import { ScoringItemForm } from "#/components/ScoringItemForm";
import { TeamForm } from "#/components/TeamForm";
import { adminBeforeLoad } from "#/routes/admin/-beforeLoad";
import { fetchHackathonById } from "../../-functions/hackathon";

export const Route = createFileRoute("/admin/hackathonList/$id/setting/")({
	loader: async ({ params }) => {
		const hackathon = await fetchHackathonById({ data: params.id });
		return { hackathon };
	},
	pendingComponent: () => <div className="bg-white">データを読み込み中...</div>,
	beforeLoad: adminBeforeLoad,
	component: HackathonListDetailPage,
});

function HackathonListDetailPage() {
	const { hackathon } = Route.useLoaderData();

	return (
		<>
			<Header>
				<h1 className="text-3xl font-bold">{hackathon.name}</h1>
			</Header>

			<div className="min-h-screen bg-gray-50">
				<div className="max-w-7xl mx-auto px-8 py-8 flex gap-8 justify-between">
					{/* チームセクション */}
					<div className="mb-12 flex-1">
						<div className="mb-6">
							<h2 className="text-3xl font-bold text-black flex items-center gap-3">
								<UsersIcon />
								<span>チーム一覧</span>
							</h2>
						</div>

						<TeamForm hackathonId={hackathon.id} />

						{hackathon.team.length === 0 ? (
							<div className="bg-white border border-gray-300 rounded-lg p-12 text-center">
								<p className="text-gray-500">チームがまだ登録されていません</p>
							</div>
						) : (
							<div className="flex flex-col">
								{hackathon.team.map((team) => (
									<div
										key={team.id}
										className="w-full py-5 border-b border-gray-300 flex items-center justify-between gap-6"
									>
										<div className="flex-1 flex justify-between gap-8 min-w-0">
											<p className="text-base font-bold truncate pl-3">
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
										<div className="flex gap-3 px-1">
											<button
												type="button"
												className="relative group"
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
												className="relative group"
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

					{/* 採点項目セクション */}
					<div className="mb-12 flex-1">
						<div className="mb-6">
							<h2 className="text-3xl font-bold text-black flex items-center gap-3">
								<NotebookPenIcon />
								<span>採点基準一覧</span>
							</h2>
						</div>

						<ScoringItemForm hackathonId={hackathon.id} />

						{hackathon.scoring_item.length === 0 ? (
							<div className="bg-white border border-gray-300 rounded-lg p-12 text-center">
								<p className="text-gray-500">
									採点項目がまだ登録されていません
								</p>
							</div>
						) : (
							<div className="flex flex-col">
								{hackathon.scoring_item.map((item) => (
									<div
										key={item.id}
										className="w-full py-5 border-b border-gray-300 flex items-center justify-between gap-6"
									>
										<div className="flex-1 flex justify-between gap-8 min-w-0">
											<p className="text-base font-bold truncate pl-3">
												{item.name}
											</p>
											<p className="text-base font-bold">{item.max_score}</p>
										</div>
										<div className="flex gap-3 px-1">
											<button
												type="button"
												className="relative group"
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
												className="relative group"
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
				</div>
			</div>
		</>
	);
}
