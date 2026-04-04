"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";
import type { GuestWithInviteStatus } from "@/lib/guests";
import { updateInvitedGuestsAction } from "@/lib/server/actions/guests";
import { fetchGuests } from "@/lib/server/guests";

type Props = {
	hackathonId: string;
};

export const InviteGuestPageClient = ({ hackathonId }: Props) => {
	const router = useRouter();

	const [guests, setGuests] = useState<GuestWithInviteStatus[]>([]);
	const [selectedGuestIds, setSelectedGuestIds] = useState<Set<string>>(
		new Set(),
	);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const [fetching, setFetching] = useState(true);
	const [success, setSuccess] = useState(false);

	const loadGuests = useCallback(async () => {
		setFetching(true);
		try {
			const res = await fetchGuests();

			setGuests(res);

			// 既に招待されているゲストを選択状態にする
			const invitedIds = new Set(
				res.filter((g) => g.isInvited).map((g) => g.id),
			);
			setSelectedGuestIds(invitedIds);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "ゲスト一覧の取得に失敗しました",
			);
		} finally {
			setFetching(false);
		}
	}, []);

	useEffect(() => {
		loadGuests();
	}, [loadGuests]);

	const handleBack = () => {
		router.push("/admin");
	};

	const handleToggleGuest = (guestId: string) => {
		setSelectedGuestIds((prev) => {
			const newSet = new Set(prev);
			if (newSet.has(guestId)) {
				newSet.delete(guestId);
			} else {
				newSet.add(guestId);
			}
			return newSet;
		});
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		setError("");
		setLoading(true);
		setSuccess(false);

		try {
			const result = await updateInvitedGuestsAction(
				hackathonId,
				Array.from(selectedGuestIds),
			);

			if (!result.success) {
				setError(result.error || "招待の更新に失敗しました");
				setLoading(false);
				return;
			}

			setSuccess(true);

			// 1秒後に戻る
			setTimeout(() => {
				handleBack();
			}, 1000);
		} catch (err) {
			setError(err instanceof Error ? err.message : "招待の更新に失敗しました");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="max-w-4xl mx-auto">
			<h1 className="text-[30px] font-black text-black mb-8">
				ゲストを招待
			</h1>

			<div className="bg-white rounded-lg shadow-lg p-8">
				<form onSubmit={handleSubmit} className="flex flex-col gap-6">
					{error && (
						<div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
							{error}
						</div>
					)}

					{success && (
						<div className="p-4 bg-green-50 border border-green-200 rounded-md text-green-600 text-sm">
							招待を更新しました
						</div>
					)}

					{fetching ? (
						<div className="flex items-center justify-center py-8">
							<div className="inline-block w-8 h-8 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
						</div>
					) : guests.length === 0 ? (
						<div className="text-center py-8 text-gray-500">
							ゲストが登録されていません
						</div>
					) : (
						<div className="max-h-96 overflow-y-auto border border-gray-200 rounded-md">
							{guests.map((guest) => (
								<label
									key={guest.id}
									className="flex items-center gap-4 p-4 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 cursor-pointer transition-colors"
								>
									<input
										type="checkbox"
										checked={selectedGuestIds.has(guest.id)}
										onChange={() => handleToggleGuest(guest.id)}
										disabled={loading}
										className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
									/>
									<div className="flex-1 min-w-0">
										<p className="font-semibold text-gray-900 truncate">
											{guest.name}
										</p>
										<p className="text-sm text-gray-600 truncate">
											{guest.company_name}
										</p>
										<p className="text-sm text-gray-500 truncate">
											{guest.email}
										</p>
									</div>
								</label>
							))}
						</div>
					)}

					<div className="flex gap-4">
						<Button
							type="button"
							variant="secondary"
							size="lg"
							onClick={handleBack}
							fullWidth
							disabled={loading}
						>
							キャンセル
						</Button>
						<Button
							type="submit"
							variant="primary"
							size="lg"
							isLoading={loading}
							fullWidth
							disabled={success || fetching}
						>
							招待を更新
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
};
