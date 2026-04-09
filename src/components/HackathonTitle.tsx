interface HackathonTitleProps {
	name: string;
	id: string;
	scoringDate: Date;
	status?: "scheduled" | "finished";
	className?: string;
	onEdit?: () => void;
	onDelete?: () => void;
}

export const HackathonTitle = ({
	name,
	id,
	scoringDate,
	status,
	className = "",
	onEdit,
	onDelete,
}: HackathonTitleProps) => {
	const formatDate = (date: Date) => {
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, "0");
		const day = String(date.getDate()).padStart(2, "0");
		return `${year}年${month}月${day}日`;
	};

	return (
		<div className={className}>
			<div className="flex justify-between items-start gap-5 mb-2.5 pb-2.5 border-b-2 border-yellow-500">
				<h2
					className="text-2xl font-bold break-all"
					data-testid="hackathon-title"
				>
					{name}
				</h2>
				<div className="flex gap-3">
					{status === "scheduled" && onEdit && (
						<button
							type="button"
							onClick={onEdit}
							aria-label="編集する"
							className="relative group"
						>
							<svg
								width="24"
								height="24"
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
					)}
					{onDelete && (
						<button
							type="button"
							onClick={onDelete}
							aria-label="削除する"
							className="relative group"
						>
							<svg
								width="24"
								height="24"
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
					)}
				</div>
			</div>
			<p className="text-xl font-bold text-gray-600">{formatDate(scoringDate)}</p>
		</div>
	);
};
