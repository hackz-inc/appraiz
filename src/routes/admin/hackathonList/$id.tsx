import { createFileRoute, Link } from "@tanstack/react-router";
import { NotebookPenIcon, UsersIcon } from "lucide-react";
import Header from "#/components/Header";
import { Card } from "#/components/ui";
import { adminBeforeLoad } from "../-beforeLoad";
import { fetchHackathonById } from "./-functions/hackathon";

export const Route = createFileRoute("/admin/hackathonList/$id")({
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
				{/* <button
					type="button"
					className="size-12 flex justify-center items-center rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors cursor-pointer"
					aria-label="ハッカソンを作成する"
				>
					<PlusIcon size={32} color="white" />
				</button> */}
			</Header>

			<div className="min-h-screen bg-gray-50">
				<div className="max-w-7xl mx-auto px-8 py-8 flex gap-4 justify-between">
					{/* ヘッダー */}

					{/* チームセクション */}
					<div className="mb-12 flex-1">
						<div className="mb-6">
							<h2 className="text-3xl font-bold text-black flex items-center gap-3">
								<UsersIcon />
								<span>チーム</span>
							</h2>
						</div>

						<Card>
							{hackathon.team.length === 0 ? (
								<div className="text-center py-12">
									<p className="text-gray-500">
										チームがまだ登録されていません
									</p>
								</div>
							) : (
								<div className="flex flex-col gap-4">
									{hackathon.team.map((team) => (
										<div
											key={team.id}
											className="bg-white border border-gray-300 rounded-lg p-4 hover:shadow-md transition-shadow"
										>
											<div className="flex items-start gap-3">
												<div className="flex-1 min-w-0">
													<h3 className="text-lg font-bold text-black mb-3 truncate">
														{team.name}
													</h3>
												</div>
											</div>
										</div>
									))}
								</div>
							)}
						</Card>
					</div>

					{/* 採点項目セクション */}
					<div className="mb-12 flex-1">
						<div className="mb-6">
							<h2 className="text-3xl font-bold text-black flex items-center gap-3">
								<NotebookPenIcon />
								<span>採点項目</span>
							</h2>
						</div>

						<Card>
							{hackathon.scoring_item.length === 0 ? (
								<div className="text-center py-12">
									<p className="text-gray-500">
										採点項目がまだ登録されていません
									</p>
								</div>
							) : (
								<div className="flex flex-col gap-4">
									{hackathon.scoring_item.map((item) => (
										<div
											key={item.id}
											className="bg-white border border-gray-300 rounded-lg p-4 hover:shadow-md transition-shadow"
										>
											<div className="flex items-center gap-4">
												<div className="flex-1 min-w-0 flex items-center justify-between gap-4">
													<div className="flex items-center gap-3 min-w-0 flex-1">
														<h3 className="text-lg font-bold text-black truncate">
															{item.name}
														</h3>
														<div className="flex-shrink-0 px-3 py-1 bg-yellow-200 rounded-full">
															<span className="text-sm font-semibold text-black">
																{item.max_score} 点
															</span>
														</div>
													</div>
												</div>
											</div>
										</div>
									))}
								</div>
							)}
						</Card>
					</div>
				</div>
			</div>
		</>
	);
}
