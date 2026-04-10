import { useState } from "react";

interface Guest {
	id: string;
	name: string;
	company_name: string;
	is_sponsored: boolean;
}

interface GuestListProps {
	hackathonId: string;
	guests: Guest[];
}

export const GuestList = ({ hackathonId, guests }: GuestListProps) => {
	const [checkedList, setCheckedList] = useState<string[]>(
		guests.filter((guest) => guest.is_sponsored).map((guest) => guest.id),
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
		} catch (error) {
			console.error("Failed to update guest list:", error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div>
			{guests.length === 0 ? (
				<div className="bg-white border border-gray-300 rounded-lg p-12 text-center">
					<p className="text-gray-500">共同開催者がいません</p>
				</div>
			) : (
				<>
					<div className="bg-white border border-gray-300 rounded-lg p-6 mb-6">
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
									{guest.name}_{guest.company_name}
								</span>
							</label>
						))}
					</div>
					<button
						type="button"
						onClick={handleSubmit}
						disabled={isLoading}
						className="mx-auto block w-[244px] h-11 flex justify-center items-center rounded-tl-[26px] rounded-bl-none rounded-br-[26px] rounded-tr-none text-base font-bold cursor-pointer border-2 border-yellow-500 shadow-md bg-gradient-to-r from-white from-0% via-white via-50% to-yellow-500 to-50% bg-[length:200%_auto] bg-right hover:bg-left transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{isLoading ? "保存中..." : "保存"}
					</button>
				</>
			)}
		</div>
	);
};
