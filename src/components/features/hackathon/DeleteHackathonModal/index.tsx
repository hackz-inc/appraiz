"use client";

import { useState } from "react";
import { Button, Card, Modal } from "@/components/ui";
import { useModalStore } from "@/stores";
import { deleteHackathon } from "../actions";
import styles from "./index.module.css";

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
			<div className={styles.content}>
				<div className={styles.message}>
					<p className={styles.warningText}>本当に削除しますか？</p>
					<p className={styles.hackathonName}>{hackathon?.name}</p>
					<p className={styles.description}>
						この操作は取り消せません。このハッカソンに関連する全てのチーム、採点項目、スコアも削除されます。
					</p>
				</div>

				{error && <div className={styles.errorMessage}>{error}</div>}

				<div className={styles.buttonGroup}>
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
