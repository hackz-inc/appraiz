import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import Header from "#/components/Header";
import { ScoreFraction } from "#/components/ui/ScoreFraction";
import { Slider } from "#/components/ui/Slider";
import { getDb } from "#/lib/db/client";
import { hackathon, team } from "#/lib/db/schema";
import "#/types/cloudflare";
import { adminBeforeLoad } from "#/routes/admin/-beforeLoad";
import type { Hackathon, ScoringItem, ScoringItemResult, ScoringResult, Team } from "#/lib/db/types";

type TeamResultData = {
	hackathon: Hackathon & {
		scoring_items: ScoringItem[];
		scoring_results: (ScoringResult & { scoring_item_results: ScoringItemResult[] })[];
	};
	team: Team;
	judges: { name: string; comment: string; itemScores: ScoringItemResult[]; total: number }[];
};

type Input = { hackathonId: string; teamId: string };

const fetchTeamResult = createServerFn({ method: "GET" })
	.inputValidator((data: Input) => data)
	.handler(async (ctx) => {
		const { hackathonId, teamId } = ctx.data;
		const db = getDb(ctx.context!);

		const [hackathonData, teamData] = await Promise.all([
			db.query.hackathon.findFirst({
				where: eq(hackathon.id, hackathonId),
				with: {
					scoring_items: true,
					scoring_results: {
						with: { scoring_item_results: true },
					},
				},
			}),
			db.query.team.findFirst({
				where: eq(team.id, teamId),
			}),
		]);

		if (!hackathonData) throw new Error("Hackathon not found");
		if (!teamData) throw new Error("Team not found");

		const judges = hackathonData.scoring_results
			.map((r) => ({
				name: r.judge_name,
				comment: r.comment,
				itemScores: r.scoring_item_results.filter(
					(ir) => ir.team_id === teamId,
				),
			}))
			.filter((j) => j.itemScores.length > 0)
			.map((j) => ({
				...j,
				total: j.itemScores.reduce((s, ir) => s + ir.score, 0),
			}));

		return { hackathon: hackathonData, team: teamData, judges };
	});

export const Route = createFileRoute(
	"/admin/hackathonList/$id/result/$teamId/",
)({
	head: ({ loaderData }) => {
		const d = loaderData as { hackathon: { name: string }; team: { name: string } } | undefined;
		return { meta: [{ title: `${d?.team?.name ?? ""} - ${d?.hackathon?.name ?? ""} | Apprai'z` }] };
	},
	beforeLoad: adminBeforeLoad,
	loader: async ({ params }) =>
		fetchTeamResult({
			data: { hackathonId: params.id, teamId: params.teamId },
		}),
	pendingComponent: () => <div className="bg-white">データを読み込み中...</div>,
	component: TeamResultPage,
});

function TeamResultPage() {
	const {
		hackathon: hackathonData,
		team: teamData,
		judges,
	} = Route.useLoaderData() as TeamResultData;

	const maxTotal = hackathonData.scoring_items.reduce(
		(s, i) => s + i.max_score,
		0,
	);

	const totalSum = judges.reduce((s, j) => s + j.total, 0);

	return (
		<>
			<Header
				breadcrumbItems={[
					{ name: "ハッカソン一覧", path: "/admin/hackathonList" },
					{ name: hackathonData.name },
					{
						name: "結果",
						path: `/admin/hackathonList/${hackathonData.id}/result`,
					},
					{ name: teamData.name },
				]}
			/>
			<div className="min-h-screen bg-white py-10 px-4">
				<div className="max-w-[928px] mx-auto">
					{/* チームヘッダー */}
					<div className="flex items-start justify-between pb-8 border-b border-gray-200 mb-8">
						<div>
							<h1 className="text-4xl font-black text-gray-900 leading-tight">
								{teamData.name}
							</h1>
							{teamData.topaz_link && (
								<a
									href={teamData.topaz_link}
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
								score={totalSum}
								maxScore={maxTotal * judges.length}
							/>
							<p className="text-xs text-gray-400 mt-1">
								{judges.length}名の合計
							</p>
						</div>
					</div>

					{/* 審査員ごとの内訳 */}
					{judges.length === 0 ? (
						<p className="text-gray-400 text-center py-12">
							採点データがありません
						</p>
					) : (
						<div className="space-y-0">
							{judges.map((judge, ji) => (
								<div
									key={`${judge.name}-${ji}`}
									className="py-8 border-b border-gray-100"
								>
									<div className="flex items-center justify-between mb-6">
										<h2 className="text-xl font-bold text-gray-800">
											{judge.name}
										</h2>
										<ScoreFraction score={judge.total} maxScore={maxTotal} />
									</div>

									<div className="space-y-4 mb-6">
										{hackathonData.scoring_items.map((item) => {
											const ir = judge.itemScores.find(
												(s) => s.scoring_item_id === item.id,
											);
											const score = ir?.score ?? 0;
											return (
												<div key={item.id}>
													<div className="flex items-center justify-between mb-1">
														<span className="text-sm font-bold text-gray-600">
															{item.name}
														</span>
														<span className="text-sm font-bold text-gray-800">
															{score} / {item.max_score}
														</span>
													</div>
													<Slider
														min={0}
														max={item.max_score}
														value={score}
														readOnly
														className="pointer-events-none w-full"
													/>
												</div>
											);
										})}
									</div>

									{(() => {
										let teamComment = judge.comment;
										try {
											const parsed = JSON.parse(judge.comment);
											if (parsed && typeof parsed === "object") {
												teamComment = parsed[teamData.id] ?? "";
											}
										} catch {
											// raw string のまま使用
										}
										return teamComment ? (
											<div className="bg-gray-50 rounded-lg px-4 py-3">
												<p className="text-xs text-gray-400 mb-1">
													一言コメント
												</p>
												<p className="text-sm text-gray-700 whitespace-pre-wrap">
													{teamComment}
												</p>
											</div>
										) : null;
									})()}
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</>
	);
}
