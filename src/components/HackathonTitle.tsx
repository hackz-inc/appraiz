interface HackathonTitleProps {
	name: string;
	id: string;
	scoringDate: Date;
	status?: "scheduled" | "finished";
	className?: string;
}

export const HackathonTitle = ({
	name,
	id: _id,
	scoringDate,
	status: _status,
	className = "",
}: HackathonTitleProps) => {
	const formatDate = (date: Date) => {
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, "0");
		const day = String(date.getDate()).padStart(2, "0");
		return `${year}年${month}月${day}日`;
	};

	return (
		<div className={className}>
			<div className="mb-2.5 pb-2.5 border-b-2 border-yellow-500">
				<h2
					className="text-2xl font-bold break-all"
					data-testid="hackathon-title"
				>
					{name}
				</h2>
			</div>
			<p className="text-xl font-bold text-gray-600">
				{formatDate(scoringDate)}
			</p>
		</div>
	);
};
