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

	// 審査員ごとのチーム別スコアを集計
	const judgeMap = new Map<string, { teamId: string; total: number }[]>();
	for (const team of data.teams) {
		for (const r of team.scoring_results) {
			const total = r.scoring_item_results.reduce((s, ir) => s + ir.score, 0);
			const existing = judgeMap.get(r.judge_name) ?? [];
			existing.push({ teamId: team.id, total });
			judgeMap.set(r.judge_name, existing);
		}
	}

	// 審査員ごとに正規化ポイントを計算（legacyのtotalPoint方式）
	const teamPoints = new Map<string, number>();
	for (const judgeResults of judgeMap.values()) {
		const scores = judgeResults.map((r) => r.total);
		const min = Math.min(...scores);
		const max = Math.max(...scores);
		const diff = max - min;
		const worth = diff === 0 ? 0 : Math.floor(1000 / diff);
		for (const { teamId, total } of judgeResults) {
			const point = (total - min) * worth;
			teamPoints.set(teamId, (teamPoints.get(teamId) ?? 0) + point);
		}
	}

	const teams = data.teams
		.map((team) => {
			const judges = team.scoring_results.map((r) => ({
				name: r.judge_name,
				total: r.scoring_item_results.reduce((s, ir) => s + ir.score, 0),
				itemScores: r.scoring_item_results,
			}));
			const totalScore = judges.reduce((s, j) => s + j.total, 0);
			const totalPoint = teamPoints.get(team.id) ?? 0;
			const itemTotals = data.scoring_items.map((item) => {
				const itemTotal = judges.reduce((s, j) => {
					const ir = j.itemScores.find((r) => r.scoring_item_id === item.id);
					return s + (ir?.score ?? 0);
				}, 0);
				return { ...item, itemTotal, maxScore: item.max_score * judges.length };
			});
			return { ...team, judges, totalScore, totalPoint, itemTotals };
		})
		.sort((a, b) => b.totalPoint - a.totalPoint);

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
										score={team.totalScore}
										maxScore={maxTotal * team.judges.length}
									/>
									<p className="text-xs text-gray-400 mt-1">
										{team.judges.length}名の合計
									</p>
								</div>
							</div>

							{/* 項目別合計スコア */}
							<div className="space-y-4 mb-8">
								{team.itemTotals.map((item) => (
									<div key={item.id}>
										<div className="flex items-center justify-between mb-1">
											<span className="text-sm font-bold text-gray-600">
												{item.name}
											</span>
											<span className="text-sm font-bold text-gray-800">
												{item.itemTotal} / {item.maxScore}
											</span>
										</div>
										<Slider
											min={0}
											max={item.maxScore}
											value={item.itemTotal}
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
