"use client";

import { useState, useEffect } from "react";
import { Button, TextInput, Card, Modal } from "@/components/ui";
import { useModalStore } from "@/stores";
import { updateHackathon } from "../actions";

export const EditHackathonModal = () => {
	const { isOpen, type, config, closeModal } = useModalStore();
	const hackathon = config.data?.hackathon;

	const [formData, setFormData] = useState({
		name: "",
		scoringDate: "",
	});
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const isEditHackathonModalOpen = isOpen && type === "editHackathon";

	// モーダルが開いた時に既存データをセット
	useEffect(() => {
		if (isEditHackathonModalOpen && hackathon) {
			setFormData({
				name: hackathon.name,
				scoringDate: hackathon.scoring_date.split("T")[0], // ISO形式からYYYY-MM-DDを取得
			});
		}
	}, [isEditHackathonModalOpen, hackathon]);

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
		if (!hackathon) return;

		setError("");
		setLoading(true);

		try {
			const result = await updateHackathon(hackathon.id, {
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

	return (
		<Modal
			isOpen={isEditHackathonModalOpen}
			onClose={handleClose}
			title="ハッカソン編集"
			size="lg"
		>
			<form onSubmit={handleSubmit} className="flex flex-col gap-6">
				{error && <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">{error}</div>}

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
						type="submit"
						variant="primary"
						size="lg"
						isLoading={loading}
						fullWidth
					>
						更新
					</Button>
				</div>
			</form>
		</Modal>
	);
};
