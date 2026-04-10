import { ScoringItemForm } from "#/components/ScoringItemForm";

interface ScoringItem {
	id: string;
	name: string;
	max_score: number;
}

interface ScoringItemListProps {
	hackathonId: string;
	scoringItems: ScoringItem[];
}

export const ScoringItemList = ({
	hackathonId,
	scoringItems,
}: ScoringItemListProps) => {
	return (
		<div>
			<ScoringItemForm hackathonId={hackathonId} />

			{scoringItems.length === 0 ? (
				<div className="bg-white border border-gray-300 rounded-lg p-12 text-center">
					<p className="text-gray-500">採点項目がまだ登録されていません</p>
				</div>
			) : (
				<div className="flex flex-col bg-white border border-gray-300 rounded-lg">
					{scoringItems.map((item) => (
						<div
							key={item.id}
							className="w-full py-5 px-6 border-b last:border-b-0 border-gray-300 flex items-center justify-between gap-6"
						>
							<div className="flex-1 flex justify-between gap-8 min-w-0">
								<p className="text-base font-bold truncate">{item.name}</p>
								<p className="text-base font-bold">{item.max_score}</p>
							</div>
							<div className="flex gap-3">
								<button
									type="button"
									className="hover:opacity-70 transition-opacity"
									aria-label="編集する"
								>
									<svg
										width="20"
										height="20"
										viewBox="0 0 24 24"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"
											stroke="#333"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
										<path
											d="M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 9.5-9.5z"
											stroke="#333"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
									</svg>
								</button>
								<button
									type="button"
									className="hover:opacity-70 transition-opacity"
									aria-label="削除する"
								>
									<svg
										width="20"
										height="20"
										viewBox="0 0 24 24"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6"
											stroke="#333"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
									</svg>
								</button>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
};
