import { createFileRoute, Link } from "@tanstack/react-router";

import { Card } from "#/components/ui";
import { adminBeforeLoad } from "../-beforeLoad";
import { fetchHackathonById } from "./-functions/hackathon";

export const Route = createFileRoute("/admin/hackathonList/$id")({
	loader: async ({ params }) => {
		const hackathon = await fetchHackathonById({ data: params.id });
		return { hackathon };
	},
	beforeLoad: adminBeforeLoad,
	component: HackathonListDetailPage,
});

function HackathonListDetailPage() {
	const { hackathon } = Route.useLoaderData();

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-7xl mx-auto px-8 py-8">
				{/* ヘッダー */}
				<div className="mb-8">
					<div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
						<Link to="/admin" className="hover:text-black">
							ホーム
						</Link>
						<span>/</span>
						<Link to="/admin/hackathonList" className="hover:text-black">
							ハッカソン一覧
						</Link>
						<span>/</span>
						<span className="text-black">{hackathon.name}</span>
					</div>
					<h1 className="text-4xl font-bold text-black">{hackathon.name}</h1>
					<p className="text-gray-600 mt-2">
						開催日:{" "}
						{new Date(hackathon.scoring_date).toLocaleDateString("ja-JP")}
					</p>
				</div>

				{/* チームセクション */}
				<div className="mb-12">
					<div className="mb-6">
						<h2 className="text-3xl font-bold text-black flex items-center gap-3">
							<span className="text-4xl">👥</span>
							<span>チーム</span>
						</h2>
					</div>

					<Card>
						{hackathon.team.length === 0 ? (
							<div className="text-center py-12">
								<p className="text-gray-500">チームがまだ登録されていません</p>
							</div>
						) : (
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
								{hackathon.team.map((team) => (
									<div
										key={team.id}
										className="bg-white border border-gray-300 rounded-lg p-4 hover:shadow-md transition-shadow"
									>
										<div className="flex items-start gap-3">
											<div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-yellow-200 rounded-full">
												<span className="text-2xl">👥</span>
											</div>
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
				<div className="mb-12">
					<div className="mb-6">
						<h2 className="text-3xl font-bold text-black flex items-center gap-3">
							<span className="text-4xl">📋</span>
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
											<div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-yellow-200 rounded-full">
												<span className="text-2xl">📋</span>
											</div>
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
	);
}
