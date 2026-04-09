import { useState } from "react";

interface ScoringItemFormProps {
	hackathonId: string;
	onItemAdded?: () => void;
}

export const ScoringItemForm = ({
	hackathonId,
	onItemAdded,
}: ScoringItemFormProps) => {
	const [itemName, setItemName] = useState("");
	const [maxScore, setMaxScore] = useState<number>(0);
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!itemName.trim() || maxScore <= 0) return;

		setIsLoading(true);
		try {
			// TODO: API呼び出しを実装
			console.log("Creating scoring item:", {
				hackathonId,
				itemName,
				maxScore,
			});

			// フォームをリセット
			setItemName("");
			setMaxScore(0);

			if (onItemAdded) {
				onItemAdded();
			}
		} catch (error) {
			console.error("Failed to create scoring item:", error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<div className="flex gap-4 items-end justify-between">
				<div className="flex-1">
					<label className="block mb-2">
						<span className="text-base font-bold text-gray-600">
							採点項目
							<span className="text-red-500 ml-1">*</span>
						</span>
					</label>
					<input
						type="text"
						value={itemName}
						onChange={(e) => setItemName(e.target.value)}
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
						placeholder="採点項目を入力"
						required
					/>
				</div>
				<div className="flex-1">
					<label className="block mb-2">
						<span className="text-base font-bold text-gray-600">
							最大得点
							<span className="text-red-500 ml-1">*</span>
						</span>
					</label>
					<input
						type="number"
						value={maxScore || ""}
						onChange={(e) => setMaxScore(Number(e.target.value))}
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
						placeholder="最大得点を入力"
						min="1"
						required
					/>
				</div>
				<button
					type="submit"
					disabled={isLoading || !itemName.trim() || maxScore <= 0}
					className="h-12 w-12 flex justify-center items-center rounded-full bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
					aria-label="採点項目を追加する"
				>
					<svg
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M12 5v14M5 12h14"
							stroke="#fff"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
				</button>
			</div>
		</form>
	);
};
