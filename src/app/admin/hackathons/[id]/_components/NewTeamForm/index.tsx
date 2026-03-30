"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button, TextInput } from "@/components/ui";
import { teams } from "@/lib/teams";
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
		<form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-6 p-4 border-b border-[var(--black-lighten3)]">
			{error && <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">{error}</div>}

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

			<button type="submit" className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[var(--yellow-primary)] text-[var(--black-primary)] font-bold rounded-lg hover:bg-[var(--yellow-lighten2)] transition-colors disabled:opacity-50">
				<PlusIcon />
				<span>チームを追加</span>
			</button>
		</form>
	);
}
