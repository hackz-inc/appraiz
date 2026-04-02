"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Modal } from "@/components/ui";
import type { GuestWithInviteStatus } from "@/lib/guests";
import {
	getGuestsWithInviteStatusAction,
	updateInvitedGuestsAction,
} from "@/lib/server/actions/guests";

export const InviteGuestModal = () => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const hackathonId = searchParams.get("invite");

	const [guests, setGuests] = useState<GuestWithInviteStatus[]>([]);
	const [selectedGuestIds, setSelectedGuestIds] = useState<Set<string>>(
		new Set(),
	);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const [fetching, setFetching] = useState(true);
	const [success, setSuccess] = useState(false);

	const loadGuests = useCallback(async () => {
		if (!hackathonId) return;

		setFetching(true);
		try {
			const guestsData = await getGuestsWithInviteStatusAction(hackathonId);
			setGuests(guestsData);

			// 既に招待されているゲストを選択状態にする
			const invitedIds = new Set(
				guestsData.filter((g) => g.isInvited).map((g) => g.id),
			);
			setSelectedGuestIds(invitedIds);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "ゲスト一覧の取得に失敗しました",
			);
		} finally {
			setFetching(false);
		}
	}, [hackathonId]);

	useEffect(() => {
		if (hackathonId) {
			loadGuests();
		}
	}, [hackathonId, loadGuests]);

	const handleClose = () => {
		setError("");
		setLoading(false);
		setSuccess(false);
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

	const handleSelectAll = () => {
		if (selectedGuestIds.size === guests.length) {
			setSelectedGuestIds(new Set());
		} else {
			setSelectedGuestIds(new Set(guests.map((g) => g.id)));
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!hackathonId) return;

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

			// 1秒後にモーダルを閉じる
			setTimeout(() => {
				handleClose();
			}, 1000);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "招待の更新に失敗しました",
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Modal
			isOpen={!!hackathonId}
			onClose={handleClose}
			title="ゲストを招待"
			size="lg"
		>
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

				<div className="flex items-center justify-between p-4 bg-gray-50 rounded-md">
					<div>
						<p className="text-sm text-gray-600">選択中</p>
						<p className="font-bold text-gray-900">
							{selectedGuestIds.size} / {guests.length} 人
						</p>
					</div>
					<Button
						type="button"
						variant="secondary"
						size="sm"
						onClick={handleSelectAll}
						disabled={fetching || loading}
					>
						{selectedGuestIds.size === guests.length
							? "すべて解除"
							: "すべて選択"}
					</Button>
				</div>

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
						onClick={handleClose}
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
		</Modal>
	);
};
