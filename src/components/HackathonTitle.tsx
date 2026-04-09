import { HandshakeIcon, SquarePenIcon, Trash2Icon } from "lucide-react";

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
					<button
						type="button"
						aria-label="共同開催者"
						className="relative group"
					>
						<HandshakeIcon />
					</button>
					<button
						type="button"
						onClick={onEdit}
						aria-label="編集する"
						className="relative group"
					>
						<SquarePenIcon />
					</button>

					{onDelete && (
						<button
							type="button"
							onClick={onDelete}
							aria-label="削除する"
							className="relative group"
						>
							<Trash2Icon />
						</button>
					)}
				</div>
			</div>
			<p className="text-xl font-bold text-gray-600">
				{formatDate(scoringDate)}
			</p>
		</div>
	);
};
