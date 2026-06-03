import { useState } from "react";
import { ScoringItemForm } from "#/components/ScoringItemForm";
import { deleteScoringItem } from "#/routes/admin/hackathonList/-functions/hackathon";

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
	const [deletingId, setDeletingId] = useState<string | null>(null);

	const handleDelete = async (id: string, name: string) => {
		if (!window.confirm(`「${name}」を削除してもよろしいですか？`)) return;
		setDeletingId(id);
		try {
			await deleteScoringItem({ data: id });
			window.location.reload();
		} catch (error) {
			console.error("Failed to delete scoring item:", error);
			alert("採点項目の削除に失敗しました");
			setDeletingId(null);
		}
	};

	return (
		<div>
			<ScoringItemForm hackathonId={hackathonId} />

			{scoringItems.length === 0 ? (
				<div className="bg-white border border-gray-300 rounded-lg p-12 text-center">
					<p className="text-gray-500">採点項目がまだ登録されていません</p>
				</div>
			) : (
				<div className="flex flex-col bg-white border border-gray-300 rounded-lg mt-4">
					{scoringItems.map((item) => (
						<div
							key={item.id}
							className="w-full py-5 px-6 border-b last:border-b-0 border-gray-300 flex items-center justify-between gap-6"
						>
							<div className="flex-1 flex justify-between gap-8 min-w-0">
								<p className="text-base font-bold truncate">{item.name}</p>
								<p className="text-base font-bold">{item.max_score}</p>
							</div>
							<button
								type="button"
								onClick={() => handleDelete(item.id, item.name)}
								disabled={deletingId === item.id}
								className="hover:opacity-70 transition-opacity disabled:opacity-30"
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
					))}
				</div>
			)}
		</div>
	);
};
