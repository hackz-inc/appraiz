import type { ScoringFormData } from "./ScoringForm";
import { ScoreFraction } from "#/components/ui/ScoreFraction";

type Props = {
	judgeName: string;
	scoringData: ScoringFormData[];
};

function ReadOnlySlider({ value, max }: { value: number; max: number }) {
	const percent = max > 0 ? Math.min((value / max) * 100, 100) : 0;
	return (
		<div className="relative flex-1 h-1 bg-gray-300 rounded-full">
			<div
				className="absolute left-0 top-0 h-full bg-brand-teal rounded-full"
				style={{ width: `${percent}%` }}
			/>
			<div
				className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-brand-teal shadow-sm"
				style={{ left: `max(0px, calc(${percent}% - 10px))` }}
			/>
		</div>
	);
}

export function ScoringPreview({ judgeName, scoringData }: Props) {
	return (
		<div className="min-h-screen bg-[#f5f5f5]">
			{/* 完了アナウンス */}
			<div className="pt-[200px] pb-16 text-center">
				<div className="relative w-full max-w-[550px] mx-auto mb-5 px-[60px] py-7 text-[1.75rem] font-semibold text-gray-800 bg-white rounded-2xl whitespace-pre-wrap shadow-sm">
					採点のご協力ありがとうございました！{"\n"}
					集計まで今しばらくお待ちください...
					<span
						className="absolute left-0 right-0 mx-auto bottom-[-20px] block w-0 h-0"
						style={{
							borderStyle: "solid",
							borderWidth: "20px 12px 0",
							borderColor: "white transparent transparent",
						}}
					/>
				</div>
				<div className="mt-14 text-7xl select-none">🎉</div>
			</div>

			{/* 採点結果 */}
			<div className="max-w-[800px] mx-auto px-[60px] pb-20">
				{/* 審査員名 */}
				<p className="text-[1.5rem] font-bold text-gray-900 break-all mb-[50px]">
					{judgeName}
				</p>

				{/* チーム別結果 */}
				{scoringData.map((team) => {
					const total = team.scoringItems.reduce(
						(sum, item) => sum + item.score,
						0,
					);
					const maxTotal = team.scoringItems.reduce(
						(sum, item) => sum + item.maxScore,
						0,
					);
					return (
						<div key={team.teamId}>
							{/* チームヘッダー: Score スタイル（合計点）+ ScoreFraction（合計/最大）の二種類 */}
							<div className="flex items-start justify-between mb-[50px]">
								<h2 className="text-[1.75rem] font-bold text-gray-900 break-words leading-snug">
									No.{team.order} : {team.teamName}
								</h2>
								<div className="flex flex-col items-end ml-4 shrink-0">
									{/* 種類1: Score スタイル — 大きな黄色の合計点 */}
									<p className="font-bold text-yellow-500 text-5xl text-center leading-none whitespace-nowrap">
										<span data-testid="team-total-score">{total}</span>
										<span className="text-3xl">点</span>
									</p>
									{/* 種類2: ScoreFraction スタイル — 合計/最大 */}
									<ScoreFraction score={total} maxScore={maxTotal} />
								</div>
							</div>

							{/* 採点項目: ReadOnly スライダー + ScoreFraction */}
							{team.scoringItems.map((item) => (
								<div key={item.id} className="mb-5">
									<p className="text-[1.25rem] font-bold text-gray-700">
										{item.name}
									</p>
									<div className="flex items-center mt-6 mb-3">
										<div className="mx-[38px] flex-1 flex items-center">
											<ReadOnlySlider
												value={item.score}
												max={item.maxScore}
											/>
										</div>
										<ScoreFraction
											score={item.score}
											maxScore={item.maxScore}
										/>
									</div>
								</div>
							))}

							{/* 一言コメント */}
							{team.comment && (
								<div className="mt-4">
									<p className="text-[1.25rem] font-bold text-gray-700 mb-3">
										一言コメント
									</p>
									<p className="w-[calc(100%-96px)] mx-auto px-4 py-5 bg-gray-100 rounded-[10px] text-base font-bold min-h-[120px] whitespace-pre-wrap">
										{team.comment}
									</p>
								</div>
							)}

							<hr className="my-[50px] h-px border-none bg-gray-300" />
						</div>
					);
				})}
			</div>
		</div>
	);
}
