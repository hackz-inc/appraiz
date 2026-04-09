import { useState } from "react";

interface TeamFormProps {
	hackathonId: string;
	onTeamAdded?: () => void;
}

export const TeamForm = ({ hackathonId, onTeamAdded }: TeamFormProps) => {
	const [teamName, setTeamName] = useState("");
	const [topazLink, setTopazLink] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!teamName.trim()) return;

		setIsLoading(true);
		try {
			// TODO: API呼び出しを実装
			console.log("Creating team:", { hackathonId, teamName, topazLink });

			// フォームをリセット
			setTeamName("");
			setTopazLink("");

			if (onTeamAdded) {
				onTeamAdded();
			}
		} catch (error) {
			console.error("Failed to create team:", error);
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
							チーム名
							<span className="text-red-500 ml-1">*</span>
						</span>
					</label>
					<input
						type="text"
						value={teamName}
						onChange={(e) => setTeamName(e.target.value)}
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
						placeholder="チーム名を入力"
						required
					/>
				</div>
				<div className="flex-1">
					<label className="block mb-2">
						<span className="text-base font-bold text-gray-600">URL</span>
					</label>
					<input
						type="url"
						value={topazLink}
						onChange={(e) => setTopazLink(e.target.value)}
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
						placeholder="https://..."
					/>
				</div>
				<button
					type="submit"
					disabled={isLoading || !teamName.trim()}
					className="h-12 w-12 flex justify-center items-center rounded-full bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
					aria-label="チームを追加する"
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
