import type { ScoringFormData } from "./ScoringForm";

type Props = {
	team: ScoringFormData;
	onScoreChange: (teamId: string, scoringItemId: string, score: number) => void;
	onCommentChange: (teamId: string, comment: string) => void;
};

export function ScoringFormItem({ team, onScoreChange, onCommentChange }: Props) {
	const totalScore = team.scoringItems.reduce((sum, item) => sum + item.score, 0);
	const maxTotalScore = team.scoringItems.reduce((sum, item) => sum + item.maxScore, 0);

	return (
		<div
			id={team.teamId}
			className="bg-white rounded-lg shadow-sm p-6 space-y-6 scroll-mt-24"
		>
			{/* Team Header */}
			<div className="border-b border-gray-200 pb-4">
				<div className="flex items-center justify-between">
					<h2 className="text-xl font-bold text-gray-900">
						{team.order}. {team.teamName}
					</h2>
					<div className="text-right">
						<div className="text-2xl font-bold text-blue-600">
							{totalScore} / {maxTotalScore}
						</div>
						<div className="text-sm text-gray-500">合計得点</div>
					</div>
				</div>
				{team.topazLink && (
					<a
						href={team.topazLink}
						target="_blank"
						rel="noopener noreferrer"
						className="mt-2 inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
					>
						Topazリンク →
					</a>
				)}
			</div>

			{/* Scoring Items */}
			<div className="space-y-6">
				{team.scoringItems.map((item) => (
					<div key={item.id} className="space-y-2">
						<label htmlFor={`${team.teamId}-${item.id}`} className="block text-sm font-medium text-gray-700">
							{item.name}
						</label>
						<div className="flex items-center gap-4">
							<input
								id={`${team.teamId}-${item.id}`}
								type="range"
								min="0"
								max={item.maxScore}
								value={item.score}
								onChange={(e) =>
									onScoreChange(team.teamId, item.id, Number(e.target.value))
								}
								className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
							/>
							<div className="min-w-[80px] text-right">
								<span className="text-lg font-semibold text-gray-900">
									{item.score}
								</span>
								<span className="text-sm text-gray-500"> / {item.maxScore}</span>
							</div>
						</div>
					</div>
				))}
			</div>

			{/* Comment */}
			<div className="space-y-2">
				<label htmlFor={`${team.teamId}-comment`} className="block text-sm font-medium text-gray-700">
					一言コメント
				</label>
				<textarea
					id={`${team.teamId}-comment`}
					value={team.comment}
					onChange={(e) => onCommentChange(team.teamId, e.target.value)}
					rows={4}
					className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
					placeholder="コメントを入力してください（任意）"
				/>
			</div>
		</div>
	);
}
