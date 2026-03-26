"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button, TextInput } from "@/components/ui";
import { scoringItems } from "@/lib/scoring";
import styles from "./index.module.css";

export function NewCriteriaForm() {
	const router = useRouter();
	const params = useParams();
	const hackathonId = params.id as string;

	const [formData, setFormData] = useState({
		name: "",
		maxScore: "10",
	});
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const handleChange = (field: string, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setLoading(true);

		try {
			await scoringItems.create({
				hackathon_id: hackathonId,
				name: formData.name,
				max_score: Number(formData.maxScore),
			});

			router.push(`/admin/hackathons/${hackathonId}`);
			router.refresh();
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "採点項目の作成に失敗しました",
			);
			setLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className={styles.form}>
			{error && <div className={styles.errorAlert}>{error}</div>}

			<TextInput
				type="text"
				label="採点項目名"
				placeholder="例: 技術力"
				value={formData.name}
				onChange={(e) => handleChange("name", e.target.value)}
				required
				fullWidth
			/>

			<TextInput
				type="number"
				label="最大スコア"
				value={formData.maxScore}
				onChange={(e) => handleChange("maxScore", e.target.value)}
				required
				fullWidth
				min={1}
			/>

			<div className={styles.buttonGroup}>
				<Button
					type="button"
					variant="secondary"
					size="lg"
					onClick={() => router.back()}
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
					作成
				</Button>
			</div>
		</form>
	);
}
