"use client";

import { useState } from "react";
import { Button, TextInput } from "@/components/ui";
import { useModalStore } from "@/stores";
import { createHackathon } from "@/components/features/hackathon/actions";
import styles from "./index.module.css";

export const CreateHackathonContent = () => {
	const { closeModal } = useModalStore();
	const [formData, setFormData] = useState({
		name: "",
		scoringDate: "",
	});
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

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
			const result = await createHackathon({
				name: formData.name,
				scoring_date: formData.scoringDate,
			});

			if (!result.success) {
				setError(result.error || "ハッカソンの作成に失敗しました");
				setLoading(false);
				return;
			}

			handleClose();
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "ハッカソンの作成に失敗しました",
			);
			setLoading(false);
		}
	};

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
				作成
			</Button>
		</form>
	);
};
