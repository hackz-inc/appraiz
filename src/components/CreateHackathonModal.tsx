import { useState } from "react";
import { createHackathon } from "#/routes/admin/hackathonList/-functions/hackathon";
import { BaseModal } from "./BaseModal";

interface Props {
	onClose: () => void;
	onCreated: () => void;
}

export const CreateHackathonModal = ({ onClose, onCreated }: Props) => {
	const [name, setName] = useState("");
	const [date, setDate] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [generatedPassword, setGeneratedPassword] = useState<string | null>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		try {
			const result = await createHackathon({ data: { name, scoringDate: date } });
			setGeneratedPassword(result.accessPassword);
			onCreated();
		} catch (error) {
			console.error("Failed to create hackathon:", error);
		} finally {
			setIsLoading(false);
		}
	};

	if (generatedPassword) {
		return (
			<BaseModal close={onClose}>
				<h2 className="text-3xl font-bold mb-6">ハッカソンを作成しました</h2>
				<p className="text-sm text-gray-600 mb-2">アクセスパスワード（審査員に共有してください）</p>
				<div className="bg-gray-100 rounded-lg px-4 py-3 text-center mb-8">
					<span className="text-2xl font-bold tracking-widest text-gray-900">
						{generatedPassword}
					</span>
				</div>
				<button
					type="button"
					onClick={onClose}
					className="mx-auto flex w-61 h-11 justify-center items-center rounded-tl-[26px] rounded-bl-none rounded-br-[26px] rounded-tr-none text-base font-bold border-2 border-yellow-500 shadow-md bg-linear-to-r from-white from-0% via-white via-50% to-yellow-500 to-50% bg-size-[200%_auto] bg-right hover:bg-left transition-all duration-300"
				>
					閉じる
				</button>
			</BaseModal>
		);
	}

	return (
		<BaseModal close={onClose}>
			<form onSubmit={handleSubmit}>
				<h2 className="text-3xl font-bold mb-8">ハッカソン作成</h2>
				<div className="flex flex-col gap-6 mb-8">
					<div>
						<label htmlFor="hackathon-name" className="block mb-2">
							<span className="text-base font-bold text-gray-600">
								ハッカソン名<span className="text-red-500 ml-1">*</span>
							</span>
						</label>
						<input
							id="hackathon-name"
							type="text"
							value={name}
							onChange={(e) => setName(e.target.value)}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
							required
						/>
					</div>
					<div>
						<label htmlFor="hackathon-date" className="block mb-2">
							<span className="text-base font-bold text-gray-600">
								採点日<span className="text-red-500 ml-1">*</span>
							</span>
						</label>
						<input
							id="hackathon-date"
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
					disabled={isLoading || !name.trim() || !date}
					className="mx-auto flex w-61 h-11 justify-center items-center rounded-tl-[26px] rounded-bl-none rounded-br-[26px] rounded-tr-none text-base font-bold cursor-pointer border-2 border-yellow-500 shadow-md bg-linear-to-r from-white from-0% via-white via-50% to-yellow-500 to-50% bg-size-[200%_auto] bg-right hover:bg-left transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{isLoading ? "作成中..." : "作成"}
				</button>
			</form>
		</BaseModal>
	);
};
