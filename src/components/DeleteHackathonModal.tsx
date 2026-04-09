import { useState } from "react";
import { BaseModal } from "./BaseModal";

interface DeleteHackathonModalProps {
	name: string;
	id: string;
	onClose: () => void;
	onDelete?: () => void;
}

export const DeleteHackathonModal = ({
	name,
	id,
	onClose,
	onDelete,
}: DeleteHackathonModalProps) => {
	const [isLoading, setIsLoading] = useState(false);

	const handleDelete = async () => {
		setIsLoading(true);
		try {
			// TODO: API呼び出しを実装
			console.log("Deleting hackathon:", id);

			if (onDelete) {
				onDelete();
			}

			onClose();
		} catch (error) {
			console.error("Failed to delete hackathon:", error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<BaseModal close={onClose}>
			<h2 className="text-3xl font-bold" data-testid="delete-hackathon-title">
				ハッカソン削除
			</h2>
			<div className="py-12 text-center">
				<p className="text-2xl font-bold leading-[50px]">
					{name}
					<br />
					<span className="text-xl text-gray-600">
						を削除してもよろしいですか？
					</span>
				</p>
			</div>
			<button
				type="button"
				onClick={handleDelete}
				disabled={isLoading}
				className="mx-auto block w-[244px] h-11 flex justify-center items-center rounded-tl-[26px] rounded-bl-none rounded-br-[26px] rounded-tr-none text-base font-bold cursor-pointer border-2 border-red-500 shadow-md bg-gradient-to-r from-white from-0% via-white via-50% to-red-500 to-50% bg-[length:200%_auto] bg-right hover:bg-left transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
				data-testid="delete-hackathon-button"
			>
				{isLoading ? "削除中..." : "削除"}
			</button>
		</BaseModal>
	);
};
