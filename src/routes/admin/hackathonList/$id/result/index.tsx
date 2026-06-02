import { Link, createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import Header from "#/components/Header";
import { ScoreFraction } from "#/components/ui/ScoreFraction";
import { Slider } from "#/components/ui/Slider";
import { getDb } from "#/lib/db/client";
import { hackathon } from "#/lib/db/schema";
import "#/types/cloudflare";
import { adminBeforeLoad } from "#/routes/admin/-beforeLoad";

const fetchHackathonResult = createServerFn({ method: "GET" })
	.inputValidator((id: string) => id)
	.handler(async (ctx) => {
		const db = getDb(ctx.context!);
		const data = await db.query.hackathon.findFirst({
			where: eq(hackathon.id, ctx.data),
			with: {
				teams: {
					with: {
						scoring_results: {
							with: { scoring_item_results: true },
						},
					},
				},
				scoring_items: true,
			},
		});
		if (!data) throw new Error("Hackathon not found");
		return data;
	});

export const Route = createFileRoute("/admin/hackathonList/$id/result/")({
	beforeLoad: adminBeforeLoad,
	loader: async ({ params }) => fetchHackathonResult({ data: params.id }),
	pendingComponent: () => <div className="bg-white">データを読み込み中...</div>,
	component: AdminResultPage,
});

function AdminResultPage() {
	const data = Route.useLoaderData();

	const maxTotal = data.scoring_items.reduce((s, i) => s + i.max_score, 0);

	const teams = data.teams
		.map((team) => {
			const judges = team.scoring_results.map((r) => ({
				name: r.judge_name,
				total: r.scoring_item_results.reduce((s, ir) => s + ir.score, 0),
				itemScores: r.scoring_item_results,
			}));
			const avg =
				judges.length > 0
					? judges.reduce((s, j) => s + j.total, 0) / judges.length
					: 0;
			const itemAverages = data.scoring_items.map((item) => {
				const scores = judges.flatMap((j) =>
					j.itemScores
						.filter((ir) => ir.scoring_item_id === item.id)
						.map((ir) => ir.score),
				);
				const itemAvg =
					scores.length > 0
						? scores.reduce((a, b) => a + b, 0) / scores.length
						: 0;
				return { ...item, avgScore: Math.round(itemAvg * 10) / 10 };
			});
			return { ...team, judges, avg, itemAverages };
		})
		.sort((a, b) => b.avg - a.avg);

	return (
		<>
			<Header
				breadcrumbItems={[
					{ name: "ハッカソン一覧", path: "/admin/hackathonList" },
					{ name: data.name },
					{ name: "結果" },
				]}
			/>
			<div className="min-h-screen bg-white py-10 px-4">
				<div className="max-w-[928px] mx-auto space-y-0">
					{teams.length === 0 && (
						<p className="text-gray-500 py-12 text-center">まだ採点データがありません。</p>
					)}

					{teams.map((team, index) => (
						<div
							key={team.id}
							id={team.id}
							className="py-12 border-b border-gray-200"
						>
							{/* チームヘッダー */}
							<div className="flex items-start justify-between mb-8">
								<div>
									<p className="text-sm text-gray-400 font-bold mb-1">
										#{index + 1}
									</p>
									<h2 className="text-4xl font-black text-gray-900 leading-tight">
										{team.name}
									</h2>
									{team.topaz_link && (
										<a
											href={team.topaz_link}
											target="_blank"
											rel="noreferrer"
											className="text-sm text-blue-500 underline mt-1 inline-block"
										>
											Topazリンク
										</a>
									)}
								</div>
								<div className="flex flex-col items-end">
									<ScoreFraction
										score={Math.round(team.avg * 10) / 10}
										maxScore={maxTotal}
									/>
									<p className="text-xs text-gray-400 mt-1">
										{team.judges.length}名の平均
									</p>
								</div>
							</div>

							{/* 項目別平均スコア */}
							<div className="space-y-4 mb-8">
								{team.itemAverages.map((item) => (
									<div key={item.id}>
										<div className="flex items-center justify-between mb-1">
											<span className="text-sm font-bold text-gray-600">
												{item.name}
											</span>
											<span className="text-sm font-bold text-gray-800">
												{item.avgScore} / {item.max_score}
											</span>
										</div>
										<Slider
											min={0}
											max={item.max_score}
											value={item.avgScore}
											readOnly
											className="pointer-events-none w-full"
										/>
									</div>
								))}
							</div>

							{/* 詳しくみるボタン */}
							<div className="flex justify-end">
								<Link
									to="/admin/hackathonList/$id/result/$teamId"
									params={{ id: data.id, teamId: team.id }}
									className="px-6 py-2 text-sm font-bold border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
								>
									詳しくみる
								</Link>
							</div>
						</div>
					))}
				</div>
			</div>
		</>
	);
}
