import type { ScoringFormData } from "./ScoringForm";

type Props = {
	judgeName: string;
	scoringData: ScoringFormData[];
};

export function ScoringPreview({ judgeName, scoringData }: Props) {
	return (
		<div className="min-h-screen bg-white">
			<div className="max-w-[800px] mx-auto px-4 py-12 space-y-8">
				<div className="text-center space-y-2">
					<p className="text-3xl font-bold text-gray-900">採点完了</p>
					<p className="text-gray-500">採点データを送信しました</p>
					<p className="text-sm text-gray-400">審査員: {judgeName}</p>
				</div>

				{scoringData.map((team) => {
					const total = team.scoringItems.reduce((sum, item) => sum + item.score, 0);
					const maxTotal = team.scoringItems.reduce((sum, item) => sum + item.maxScore, 0);
					return (
						<div key={team.teamId} className="border border-gray-200 rounded-lg p-6 space-y-4">
							<div className="flex items-center justify-between">
								<h2 className="text-lg font-bold text-gray-800">
									No.{team.order} {team.name}
								</h2>
								<span className="text-xl font-bold text-blue-600">
									{total} / {maxTotal}点
								</span>
							</div>

							<div className="space-y-2">
								{team.scoringItems.map((item) => (
									<div key={item.id} className="flex items-center justify-between text-sm">
										<span className="text-gray-600">{item.name}</span>
										<span className="font-medium text-gray-800">
											{item.score} / {item.maxScore}点
										</span>
									</div>
								))}
							</div>

							{team.comment && (
								<div className="bg-gray-50 rounded p-3">
									<p className="text-xs text-gray-400 mb-1">コメント</p>
									<p className="text-sm text-gray-700 whitespace-pre-wrap">{team.comment}</p>
								</div>
							)}
						</div>
					);
				})}
			</div>
		</div>
	);
}
