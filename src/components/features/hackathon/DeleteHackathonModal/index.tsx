"use client";

import { useState } from "react";
import { Button, Card, Modal } from "@/components/ui";
import { useModalStore } from "@/stores";
import { deleteHackathon } from "../actions";

export const DeleteHackathonModal = () => {
	const { isOpen, type, config, closeModal } = useModalStore();
	const hackathon = config.data?.hackathon;

	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const isDeleteHackathonModalOpen = isOpen && type === "deleteHackathon";

	const handleClose = () => {
		setError("");
		setLoading(false);
		closeModal();
	};

	const handleDelete = async () => {
		if (!hackathon) return;

		setError("");
		setLoading(true);

		try {
			const result = await deleteHackathon(hackathon.id);

			if (!result.success) {
				setError(result.error || "ハッカソンの削除に失敗しました");
				setLoading(false);
				return;
			}

			handleClose();
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "ハッカソンの削除に失敗しました",
			);
			setLoading(false);
		}
	};

	return (
		<Modal
			isOpen={isDeleteHackathonModalOpen}
			onClose={handleClose}
			title="ハッカソン削除"
			size="md"
		>
			<div className="flex flex-col gap-6">
				<div className="text-center">
					<p className="text-lg font-bold text-red-600 mb-2">本当に削除しますか？</p>
					<p className="text-xl font-bold text-[var(--black-primary)] mb-4">{hackathon?.name}</p>
					<p className="text-sm text-[var(--black-lighten1)] leading-relaxed">
						この操作は取り消せません。このハッカソンに関連する全てのチーム、採点項目、スコアも削除されます。
					</p>
				</div>

				{error && <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">{error}</div>}

				<div className="flex gap-4">
					<Button
						type="button"
						variant="secondary"
						size="lg"
						onClick={handleClose}
						fullWidth
					>
						キャンセル
					</Button>
					<Button
						type="button"
						variant="danger"
						size="lg"
						onClick={handleDelete}
						isLoading={loading}
						fullWidth
					>
						削除
					</Button>
				</div>
			</div>
		</Modal>
	);
};
