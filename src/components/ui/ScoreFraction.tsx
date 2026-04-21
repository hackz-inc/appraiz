import { ComponentPropsWithRef } from "react";

interface ScoreFractionProps extends ComponentPropsWithRef<"div"> {
	score: number;
	maxScore: number;
}

export function ScoreFraction({
	score,
	maxScore,
	className = "",
	...props
}: ScoreFractionProps) {
	return (
		<div
			className={`flex items-end gap-2 w-fit h-[70px] ${className}`}
			{...props}
		>
			<p
				className="min-w-[64px] text-yellow-500 text-[3.6rem] font-bold text-right leading-none"
				data-testid="score"
			>
				{score}
			</p>
			<div className="relative min-w-[36px] self-end pb-1">
				<div
					className="absolute right-[10px] bottom-[20px] w-[60px] h-[4px] bg-gray-300 rounded-[10px] rotate-[-45deg] origin-center"
					aria-hidden="true"
				/>
				<p
					className="relative text-gray-400 text-[2rem] font-bold leading-none"
					data-testid="max-score"
				>
					{maxScore}
				</p>
			</div>
		</div>
	);
}
