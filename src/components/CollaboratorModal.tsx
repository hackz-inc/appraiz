import { useState } from "react";
import { BaseModal } from "./BaseModal";

interface Guest {
	id: string;
	name: string;
	companyName: string;
	isSponsored: boolean;
}

interface CollaboratorModalProps {
	hackathonId: string;
	guests: Guest[];
	onClose: () => void;
	onSave?: () => void;
}

export const CollaboratorModal = ({
	hackathonId,
	guests,
	onClose,
	onSave,
}: CollaboratorModalProps) => {
	const [checkedList, setCheckedList] = useState<string[]>(
		guests.filter((guest) => guest.isSponsored).map((guest) => guest.id),
	);
	const [isLoading, setIsLoading] = useState(false);

	const handleChange = (guestId: string, checked: boolean) => {
		if (checked) {
			setCheckedList([...checkedList, guestId]);
		} else {
			setCheckedList(checkedList.filter((id) => id !== guestId));
		}
	};

	const handleSubmit = async () => {
		setIsLoading(true);

		try {
			// TODO: API呼び出しを実装
			console.log("Updating guest list:", {
				hackathonId,
				guestIdList: checkedList,
			});

			if (onSave) {
				onSave();
			}

			onClose();
		} catch (error) {
			console.error("Failed to update guest list:", error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<BaseModal close={onClose}>
			<div>
				<h2
					className="text-3xl font-bold mb-8"
					data-testid="guest-list-title"
				>
					共同開催者一覧
				</h2>

				<div className="mb-8 max-h-[400px] overflow-y-auto">
					{guests.length === 0 ? (
						<p className="text-gray-600 text-center py-8">
							共同開催者がいません
						</p>
					) : (
						<div className="flex flex-col gap-3">
							{guests.map((guest) => (
								<label
									key={guest.id}
									className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded cursor-pointer"
								>
									<input
										type="checkbox"
										checked={checkedList.includes(guest.id)}
										onChange={(e) => handleChange(guest.id, e.target.checked)}
										className="w-5 h-5 text-yellow-500 border-gray-300 rounded focus:ring-yellow-500"
										data-testid="guest-item"
									/>
									<span className="text-base font-bold">
										{guest.name}_{guest.companyName}
									</span>
								</label>
							))}
						</div>
					)}
				</div>

				<button
					type="button"
					onClick={handleSubmit}
					disabled={isLoading}
					className="mx-auto block w-[244px] h-11 flex justify-center items-center rounded-tl-[26px] rounded-bl-none rounded-br-[26px] rounded-tr-none text-base font-bold cursor-pointer border-2 border-yellow-500 shadow-md bg-gradient-to-r from-white from-0% via-white via-50% to-yellow-500 to-50% bg-[length:200%_auto] bg-right hover:bg-left transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{isLoading ? "保存中..." : "保存"}
				</button>
			</div>
		</BaseModal>
	);
};
