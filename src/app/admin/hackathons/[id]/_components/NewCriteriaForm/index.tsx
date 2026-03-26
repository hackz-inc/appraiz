"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button, TextInput, Container, Card } from "@/components/ui";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { useHackathon } from "@/hooks/useHackathons";
import { scoringItems } from "@/lib/scoring";
import styles from "./index.module.css";

export function NewCriteriaForm() {
	const router = useRouter();
	const params = useParams();
	const hackathonId = params.id as string;
	const { hackathon } = useHackathon(hackathonId);

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
		<div className={styles.pageContainer}>
			<AdminHeader
				breadcrumbs={[
					{ label: "ホーム", href: "/admin" },
					...(hackathon
						? [
								{
									label: hackathon.name,
									href: `/admin/hackathons/${hackathonId}`,
								},
							]
						: []),
					{ label: "採点項目", href: `/admin/hackathons/${hackathonId}/criteria` },
					{ label: "新規作成" },
				]}
			/>
			<Container maxWidth="md" className={styles.contentContainer}>
				<Card className={styles.card}>
					<div className={styles.headerSection}>
						<h1 className={styles.headerTitle}>
							採点項目作成
						</h1>
						<p className={styles.headerDescription}>
							新しい採点項目を作成します
						</p>
					</div>

					<form onSubmit={handleSubmit} className={styles.form}>
						{error && (
							<div className={styles.errorAlert}>
								{error}
							</div>
						)}

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
				</Card>
			</Container>
		</div>
	);
}
