import { useState } from "react";
import { BaseModal } from "./BaseModal";

interface EditHackathonModalProps {
	hackathonId: string;
	name: string;
	scoringDate: Date;
	onClose: () => void;
	onUpdate?: () => void;
}

export const EditHackathonModal = ({
	hackathonId,
	name,
	scoringDate,
	onClose,
	onUpdate,
}: EditHackathonModalProps) => {
	const [hackathonName, setHackathonName] = useState(name);
	const [date, setDate] = useState(
		scoringDate.toISOString().split("T")[0],
	);
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			// TODO: API呼び出しを実装
			console.log("Updating hackathon:", {
				hackathonId,
				name: hackathonName,
				scoringDate: date,
			});

			if (onUpdate) {
				onUpdate();
			}

			onClose();
		} catch (error) {
			console.error("Failed to update hackathon:", error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<BaseModal close={onClose}>
			<form onSubmit={handleSubmit}>
				<h2
					className="text-3xl font-bold mb-8"
					data-testid="edit-hackathon-title"
				>
					ハッカソン編集
				</h2>

				<div className="flex flex-col gap-8 mb-8">
					<div>
						<label className="block mb-2">
							<span className="text-base font-bold text-gray-600">
								ハッカソン名
								<span className="text-red-500 ml-1">*</span>
							</span>
						</label>
						<input
							type="text"
							value={hackathonName}
							onChange={(e) => setHackathonName(e.target.value)}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
							required
						/>
					</div>

					<div>
						<label className="block mb-2">
							<span className="text-base font-bold text-gray-600">
								採点日
								<span className="text-red-500 ml-1">*</span>
							</span>
						</label>
						<input
							type="date"
							value={date}
							onChange={(e) => setDate(e.target.value)}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
							required
						/>
					</div>
				</div>

				<button
					type="submit"
					disabled={isLoading || !hackathonName.trim()}
					className="mx-auto block w-[244px] h-11 flex justify-center items-center rounded-tl-[26px] rounded-bl-none rounded-br-[26px] rounded-tr-none text-base font-bold cursor-pointer border-2 border-yellow-500 shadow-md bg-gradient-to-r from-white from-0% via-white via-50% to-yellow-500 to-50% bg-[length:200%_auto] bg-right hover:bg-left transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
					data-testid="update-hackathon-button"
				>
					{isLoading ? "保存中..." : "保存"}
				</button>
			</form>
		</BaseModal>
	);
};
