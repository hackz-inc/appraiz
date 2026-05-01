import type { ScoringFormData } from "./ScoringForm";
import { Slider } from "#/components/ui/Slider";
import { ScoreFraction } from "#/components/ui/ScoreFraction";

type Props = {
	team: ScoringFormData;
	onScoreChange: (teamId: string, scoringItemId: string, score: number) => void;
	onCommentChange: (teamId: string, comment: string) => void;
};

export function ScoringFormItem({ team, onScoreChange, onCommentChange }: Props) {
	const totalScore = team.scoringItems.reduce((sum, item) => sum + item.score, 0);

	return (
		<div
			id={team.teamId}
			className="w-full max-w-[800px] mx-auto py-12 border-b border-gray-300 scroll-mt-24"
		>
			{/* Team Header */}
			<div className="mb-5">
				<div className="flex items-start justify-between mb-2.5">
					<div className="flex flex-col">
						<h2 className="text-2xl font-normal text-gray-900 break-words mb-2.5">
							No.{team.order} : {team.teamName}
						</h2>
						{team.topazLink && (
							<a
								href={team.topazLink}
								target="_blank"
								rel="noopener noreferrer"
								className="relative w-fit text-base font-bold text-blue-600 no-underline transition-all duration-300 before:content-[''] before:absolute before:bottom-0 before:left-0 before:w-full before:h-[1.5px] before:bg-blue-600 before:scale-x-0 before:origin-left before:transition-transform before:duration-300 hover:before:scale-x-100"
							>
								URL
							</a>
						)}
					</div>
					<div className="text-center font-bold text-yellow-500">
						<p className="text-4xl">
							<span>{totalScore}</span>
							<span className="text-2xl">点</span>
						</p>
					</div>
				</div>
			</div>

			{/* Scoring Items */}
			<div className="space-y-0">
				{team.scoringItems.map((item) => (
					<div key={item.id} className="mb-5">
						<div className="block text-base font-bold leading-7 text-gray-700 tracking-wide mb-0">
							{item.name}
						</div>
						<div className="flex items-center">
							<div className="mx-12 flex-1">
								<Slider
									min={0}
									max={item.maxScore}
									value={item.score}
									onChange={(_, value) => onScoreChange(team.teamId, item.id, value)}
								/>
							</div>
							<ScoreFraction score={item.score} maxScore={item.maxScore} />
						</div>
					</div>
				))}
			</div>

			{/* Comment */}
			<div className="mb-5">
				<label htmlFor={`${team.teamId}-comment`} className="block text-base font-bold leading-7 text-gray-700 tracking-wide mb-0">
					一言コメント
				</label>
				<textarea
					id={`${team.teamId}-comment`}
					value={team.comment}
					onChange={(e) => onCommentChange(team.teamId, e.target.value)}
					rows={4}
					className="w-[calc(100%-96px)] mx-auto mt-5 block px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
					placeholder="コメントを入力してください（任意）"
				/>
			</div>
		</div>
	);
}
