import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import Header from "#/components/Header";
import { ScoreFraction } from "#/components/ui/ScoreFraction";
import { Slider } from "#/components/ui/Slider";
import { getDb } from "#/lib/db/client";
import { hackathon } from "#/lib/db/schema";
import "#/types/cloudflare";
import { guestBeforeLoad } from "../../../-beforeLoad";
import type { Hackathon, ScoringItem, ScoringItemResult, ScoringResult, Team } from "#/lib/db/types";

type GuestHackathonResultData = Hackathon & {
	teams: Team[];
	scoring_items: ScoringItem[];
	scoring_results: (ScoringResult & { scoring_item_results: ScoringItemResult[] })[];
};

const fetchHackathonResult = createServerFn({ method: "GET" })
	.inputValidator((id: string) => id)
	.handler(async (ctx) => {
		// biome-ignore lint/style/noNonNullAssertion: always set in Cloudflare Worker
		const db = getDb(ctx.context!);
		const data = await db.query.hackathon.findFirst({
			where: eq(hackathon.id, ctx.data),
			with: {
				teams: true,
				scoring_items: true,
				scoring_results: {
					with: { scoring_item_results: true },
				},
			},
		});
		if (!data) throw new Error("Hackathon not found");
		return data;
	});

export const Route = createFileRoute("/guest/hackathonList/$id/result/")({
	head: ({ loaderData }) => {
		const d = loaderData as { name: string } | undefined;
		return { meta: [{ title: `${d?.name ?? ""} - 結果 | Apprai'z` }] };
	},
	beforeLoad: guestBeforeLoad,
	loader: async ({ params }) => fetchHackathonResult({ data: params.id }),
	pendingComponent: () => <div className="bg-white">データを読み込み中...</div>,
	component: GuestResultPage,
});

function GuestResultPage() {
	const data = Route.useLoaderData() as GuestHackathonResultData;

	const maxTotal = data.scoring_items.reduce((s, i) => s + i.max_score, 0);

	// 審査員ごとのチーム別合計スコアを集計
	const judgeEntries = data.scoring_results.map((r) => {
		const teamTotals = new Map<string, number>();
		for (const ir of r.scoring_item_results) {
			teamTotals.set(ir.team_id, (teamTotals.get(ir.team_id) ?? 0) + ir.score);
		}
		return Array.from(teamTotals.entries()).map(([teamId, total]) => ({
			teamId,
			total,
		}));
	});

	// 審査員ごとに正規化ポイントを計算（legacyのtotalPoint方式）
	const teamPoints = new Map<string, number>();
	for (const judgeResults of judgeEntries) {
		if (judgeResults.length === 0) continue;
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

	const sortedTeams = data.teams
		.map((team) => {
			const judges = data.scoring_results
				.map((r) => {
					const teamItems = r.scoring_item_results.filter(
						(ir) => ir.team_id === team.id,
					);
					return {
						total: teamItems.reduce((s, ir) => s + ir.score, 0),
						itemScores: teamItems,
					};
				})
				.filter((j) => j.itemScores.length > 0);

			const totalScore = judges.reduce((s, j) => s + j.total, 0);
			const totalPoint = teamPoints.get(team.id) ?? 0;
			const judgeCount = Math.max(1, judges.length);
			const itemTotals = data.scoring_items.map((item) => {
				const itemTotal = judges.reduce((s, j) => {
					const ir = j.itemScores.find((r) => r.scoring_item_id === item.id);
					return s + (ir?.score ?? 0);
				}, 0);
				return { ...item, itemTotal, maxScore: item.max_score * judgeCount };
			});
			return {
				...team,
				judges,
				totalScore,
				totalPoint,
				itemTotals,
				judgeCount,
			};
		})
		.sort((a, b) =>
			b.totalPoint !== a.totalPoint
				? b.totalPoint - a.totalPoint
				: b.totalScore - a.totalScore,
		);

	// 同点考慮した順位計算
	const rankedTeams = sortedTeams.map((team, index) => {
		let rank = index + 1;
		if (index > 0) {
			const prev = sortedTeams[index - 1];
			if (
				prev.totalPoint === team.totalPoint &&
				prev.totalScore === team.totalScore
			) {
				rank = (rankedTeams[index - 1] as typeof team & { rank: number }).rank;
			}
		}
		return { ...team, rank };
	});

	return (
		<>
			<Header
				breadcrumbItems={[
					{ name: "ハッカソン一覧", path: "/guest/hackathonList" },
					{ name: data.name, path: `/guest/hackathonList/${data.id}` },
					{ name: "結果" },
				]}
			/>
			<div className="min-h-screen bg-white py-10 px-4">
				<div className="max-w-[928px] mx-auto space-y-0">
					{rankedTeams.length === 0 && (
						<p className="text-gray-500 py-12 text-center">
							まだ採点データがありません。
						</p>
					)}

					{rankedTeams.map((team) => (
						<div
							key={team.id}
							id={team.id}
							className="py-12 border-b border-gray-200"
						>
							{/* チームヘッダー */}
							<div className="flex items-start justify-between mb-8">
								<div>
									<p className="text-sm text-gray-400 font-bold mb-1">
										#{team.rank}
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
									<div className="flex items-end gap-3">
										<ScoreFraction
											score={team.totalScore}
											maxScore={maxTotal * team.judgeCount}
										/>
										<p className="text-2xl font-bold text-yellow-500 mb-2">
											({team.totalPoint}Pt)
										</p>
									</div>
									<p className="text-xs text-gray-400 mt-1">
										{team.judges.length}名の合計
									</p>
								</div>
							</div>

							{/* 項目別合計スコア */}
							<div className="space-y-4">
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
						</div>
					))}
				</div>
			</div>
		</>
	);
}
