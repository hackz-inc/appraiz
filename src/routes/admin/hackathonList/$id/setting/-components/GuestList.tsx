import { useState } from "react";
import {
	addGuestToHackathon,
	removeGuestFromHackathon,
} from "../../../-functions/hackathon";

interface Guest {
	id: string;
	name: string;
	company_name: string;
	email: string;
	is_invited: boolean;
}

interface GuestListProps {
	hackathonId: string;
	guests: Guest[];
}

export const GuestList = ({ hackathonId, guests }: GuestListProps) => {
	const [localGuests, setLocalGuests] = useState<Guest[]>(guests);
	const [isUpdating, setIsUpdating] = useState(false);

	const handleToggle = async (guestId: string, currentStatus: boolean) => {
		setIsUpdating(true);
		try {
			if (currentStatus) {
				// Remove guest from hackathon
				await removeGuestFromHackathon({
					data: {
						hackathonId,
						guestId,
					},
				});
			} else {
				// Add guest to hackathon
				await addGuestToHackathon({
					data: {
						hackathonId,
						guestId,
					},
				});
			}

			// Update local state
			setLocalGuests(
				localGuests.map((g) =>
					g.id === guestId ? { ...g, is_invited: !currentStatus } : g,
				),
			);
		} catch (error) {
			console.error("Failed to update guest status:", error);
			alert("エラーが発生しました。もう一度お試しください。");
		} finally {
			setIsUpdating(false);
		}
	};


	return (
		<div>
			<div className="mb-6">
				<p className="text-sm text-gray-600 mb-2">
					全てのゲストが表示されています。トグルボタンでこのハッカソンの共同開催者として追加/削除できます。
				</p>
			</div>

			{localGuests.length === 0 ? (
				<div className="bg-white border border-gray-300 rounded-lg p-12 text-center">
					<p className="text-gray-500">共同開催者がいません</p>
				</div>
			) : (
				<div className="bg-white border border-gray-300 rounded-lg">
					{localGuests.map((guest, index) => (
						<div
							key={guest.id}
							className={`flex items-center justify-between p-6 ${
								index !== localGuests.length - 1
									? "border-b border-gray-300"
									: ""
							}`}
						>
							<div className="flex-1">
								<p className="text-base font-bold mb-1">
									{guest.name} - {guest.company_name}
								</p>
								<p className="text-sm text-gray-600">{guest.email}</p>
							</div>
							<label className="relative inline-flex items-center cursor-pointer">
								<input
									type="checkbox"
									checked={guest.is_invited}
									onChange={() => handleToggle(guest.id, guest.is_invited)}
									disabled={isUpdating}
									className="sr-only peer"
								/>
								<div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500" />
							</label>
						</div>
					))}
				</div>
			)}

		</div>
	);
};
