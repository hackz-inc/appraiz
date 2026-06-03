import { useState } from "react";
import {
	addGuestToHackathon,
	removeGuestFromHackathon,
	updateGuestPermission,
} from "../../../-functions/hackathon";

interface Guest {
	id: string;
	name: string;
	company_name: string;
	email: string;
	is_invited: boolean;
	permission: "view" | "edit";
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
				await removeGuestFromHackathon({ data: { hackathonId, guestId } });
				setLocalGuests(
					localGuests.map((g) =>
						g.id === guestId ? { ...g, is_invited: false } : g,
					),
				);
			} else {
				await addGuestToHackathon({
					data: { hackathonId, guestId, permission: "view" },
				});
				setLocalGuests(
					localGuests.map((g) =>
						g.id === guestId
							? { ...g, is_invited: true, permission: "view" }
							: g,
					),
				);
			}
		} catch (error) {
			console.error("Failed to update guest status:", error);
			alert("エラーが発生しました。もう一度お試しください。");
		} finally {
			setIsUpdating(false);
		}
	};

	const handlePermissionChange = async (
		guestId: string,
		permission: "view" | "edit",
	) => {
		setIsUpdating(true);
		try {
			await updateGuestPermission({ data: { hackathonId, guestId, permission } });
			setLocalGuests(
				localGuests.map((g) =>
					g.id === guestId ? { ...g, permission } : g,
				),
			);
		} catch (error) {
			console.error("Failed to update permission:", error);
			alert("権限の更新に失敗しました。");
		} finally {
			setIsUpdating(false);
		}
	};

	return (
		<div>
			<div className="mb-6">
				<p className="text-sm text-gray-600 mb-2">
					トグルで招待/解除、招待中のゲストには閲覧・編集権限を設定できます。
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
							className={`flex items-center justify-between p-6 gap-4 ${
								index !== localGuests.length - 1
									? "border-b border-gray-300"
									: ""
							}`}
						>
							<div className="flex-1 min-w-0">
								<p className="text-base font-bold mb-1 truncate">
									{guest.name} - {guest.company_name}
								</p>
								<p className="text-sm text-gray-600">{guest.email}</p>
							</div>

							<div className="flex items-center gap-4 shrink-0">
								{guest.is_invited && (
									<select
										value={guest.permission}
										onChange={(e) =>
											handlePermissionChange(
												guest.id,
												e.target.value as "view" | "edit",
											)
										}
										disabled={isUpdating}
										className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-yellow-500 disabled:opacity-50"
									>
										<option value="view">閲覧のみ</option>
										<option value="edit">編集可</option>
									</select>
								)}

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
						</div>
					))}
				</div>
			)}
		</div>
	);
};
