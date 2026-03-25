"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui";
import { useModalStore } from "@/stores";
import { deleteHackathon } from "@/components/features/hackathon/actions";
import { hackathons } from "@/lib/hackathons";
import styles from "./index.module.css";

export const DeleteHackathonContent = () => {
	const { config, closeModal } = useModalStore();
	const hackathonId = config.data?.hackathonId as string;

	const [hackathonName, setHackathonName] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const [initialLoading, setInitialLoading] = useState(true);

	useEffect(() => {
		const loadHackathon = async () => {
			if (!hackathonId) return;

			try {
				const data = await hackathons.getById(hackathonId);
				setHackathonName(data.name);
			} catch (err) {
				setError(
					err instanceof Error ? err.message : "データの読み込みに失敗しました",
				);
			} finally {
				setInitialLoading(false);
			}
		};

		loadHackathon();
	}, [hackathonId]);

	const handleClose = () => {
		setError("");
		setLoading(false);
		closeModal();
	};

	const handleDelete = async () => {
		setError("");
		setLoading(true);

		try {
			const result = await deleteHackathon(hackathonId);

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

	if (initialLoading) {
		return <div className={styles.loading}>読み込み中...</div>;
	}

	return (
		<div className={styles.content}>
			{error && <div className={styles.error}>{error}</div>}

			<div className={styles.confirmText}>
				<p className={styles.hackathonName}>{hackathonName}</p>
				<p className={styles.message}>を削除してもよろしいですか？</p>
			</div>

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
	);
};
