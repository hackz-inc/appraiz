"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button, TextInput } from "@/components/ui";
import { scoringItems } from "@/lib/scoring";
import { PlusIcon } from "@/components/ui/icons";

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
		<form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-6 p-4 border-b border-[var(--black-lighten3)]">
			{error && <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">{error}</div>}

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

			<button type="submit" className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[var(--yellow-primary)] text-[var(--black-primary)] font-bold rounded-lg hover:bg-[var(--yellow-lighten2)] transition-colors disabled:opacity-50">
				<PlusIcon />
				<span>採点項目を追加</span>
			</button>
		</form>
	);
}
