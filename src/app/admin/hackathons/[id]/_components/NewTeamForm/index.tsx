"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button, TextInput, Container, Card } from "@/components/ui";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { useHackathon } from "@/hooks/useHackathons";
import { teams } from "@/lib/teams";
import styles from "./index.module.css";

export function NewTeamForm() {
	const router = useRouter();
	const params = useParams();
	const hackathonId = params.id as string;
	const { hackathon } = useHackathon(hackathonId);

	const [formData, setFormData] = useState({
		name: "",
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
			await teams.create({
				hackathon_id: hackathonId,
				name: formData.name,
			});

			router.push(`/admin/hackathons/${hackathonId}`);
			router.refresh();
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "チームの作成に失敗しました",
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
					{ label: "チーム", href: `/admin/hackathons/${hackathonId}/teams` },
					{ label: "新規作成" },
				]}
			/>
			<Container maxWidth="md" className={styles.contentContainer}>
				<Card className={styles.card}>
					<div className={styles.headerSection}>
						<h1 className={styles.headerTitle}>
							チーム作成
						</h1>
						<p className={styles.headerDescription}>
							新しいチームを作成します
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
							label="チーム名"
							placeholder="例: Team Alpha"
							value={formData.name}
							onChange={(e) => handleChange("name", e.target.value)}
							required
							fullWidth
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
