"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button, TextInput, TextArea, Container, Card } from "@/components/ui";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { useHackathon } from "@/hooks/useHackathons";
import { teams } from "@/lib/teams";

export default function NewTeamPage() {
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
		<div className="min-h-screen bg-black-lighten5">
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
			<Container maxWidth="md" className="py-12">
				<Card className="w-full">
					<div className="text-center mb-8">
						<h1 className="text-4xl font-bold text-black-primary mb-2">
							チーム作成
						</h1>
						<p className="text-lg text-black-lighten1">
							新しいチームを作成します
						</p>
					</div>

					<form onSubmit={handleSubmit} className="space-y-6">
						{error && (
							<div className="p-4 bg-red bg-opacity-10 border border-red rounded text-red text-sm">
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

						<div className="flex gap-4">
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
