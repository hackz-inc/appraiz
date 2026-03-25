"use client";

import { useState, useEffect } from "react";
import { Button, TextInput } from "@/components/ui";
import { useModalStore } from "@/stores";
import { updateHackathon } from "@/components/features/hackathon/actions";
import { hackathons } from "@/lib/hackathons";
import styles from "./index.module.css";

export const EditHackathonContent = () => {
	const { config, closeModal } = useModalStore();
	const hackathonId = config.data?.hackathonId as string;

	const [formData, setFormData] = useState({
		name: "",
		scoringDate: "",
	});
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const [initialLoading, setInitialLoading] = useState(true);

	useEffect(() => {
		const loadHackathon = async () => {
			if (!hackathonId) return;

			try {
				const data = await hackathons.getById(hackathonId);
				setFormData({
					name: data.name,
					scoringDate: data.scoring_date.split("T")[0],
				});
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

	const handleChange = (field: string, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	const handleClose = () => {
		setFormData({ name: "", scoringDate: "" });
		setError("");
		setLoading(false);
		closeModal();
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setLoading(true);

		try {
			const result = await updateHackathon(hackathonId, {
				name: formData.name,
				scoring_date: formData.scoringDate,
			});

			if (!result.success) {
				setError(result.error || "ハッカソンの更新に失敗しました");
				setLoading(false);
				return;
			}

			handleClose();
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "ハッカソンの更新に失敗しました",
			);
			setLoading(false);
		}
	};

	if (initialLoading) {
		return <div className={styles.loading}>読み込み中...</div>;
	}

	return (
		<form onSubmit={handleSubmit} className={styles.form}>
			{error && <div className={styles.error}>{error}</div>}

			<TextInput
				type="text"
				label="ハッカソン名"
				placeholder="例: Spring Hackathon 2024"
				value={formData.name}
				onChange={(e) => handleChange("name", e.target.value)}
				required
				fullWidth
			/>

			<TextInput
				type="date"
				label="採点日"
				value={formData.scoringDate}
				onChange={(e) => handleChange("scoringDate", e.target.value)}
				required
				fullWidth
			/>
			<Button
				type="submit"
				variant="primary"
				size="lg"
				isLoading={loading}
				fullWidth
			>
				更新
			</Button>
		</form>
	);
};
