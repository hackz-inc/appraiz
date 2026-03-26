"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button, TextInput } from "@/components/ui";
import { teams } from "@/lib/teams";
import styles from "./index.module.css";
import { PlusIcon } from "@/components/ui/icons";

export function NewTeamForm() {
	const router = useRouter();
	const params = useParams();
	const hackathonId = params.id as string;

	const [formData, setFormData] = useState({
		name: "",
		url: "",
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
		<form onSubmit={handleSubmit} className={styles.form}>
			{error && <div className={styles.errorAlert}>{error}</div>}

			<TextInput
				type="text"
				label="チーム名"
				placeholder="例: Team Alpha"
				value={formData.name}
				onChange={(e) => handleChange("name", e.target.value)}
				required
				fullWidth
			/>

			<TextInput
				type="text"
				label="URL"
				placeholder="例: https://team-alpha.com"
				value={formData.url}
				onChange={(e) => handleChange("url", e.target.value)}
				required
				fullWidth
			/>

			<button type="submit">
				<PlusIcon />
			</button>
		</form>
	);
}
