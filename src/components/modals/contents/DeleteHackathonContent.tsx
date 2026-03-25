"use client";

import { useState, useEffect } from "react";
import { Button, Card } from "@/components/ui";
import { useModalStore } from "@/stores";
import { deleteHackathon } from "@/components/features/hackathon/actions";
import { hackathons } from "@/lib/hackathons";

export const DeleteHackathonContent = () => {
	const { config, closeModal } = useModalStore();
	const hackathonId = config.data?.hackathonId as string;

	const [hackathonName, setHackathonName] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const [initialLoading, setInitialLoading] = useState(true);

	useEffect(() => {
		const loadHackathon = async () => {
			if (!hackathonId) return;

			try {
				const data = await hackathons.getById(hackathonId);
				setHackathonName(data.name);
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

	const handleClose = () => {
		setError("");
		setLoading(false);
		closeModal();
	};

	const handleDelete = async () => {
		setError("");
		setLoading(true);

		try {
			const result = await deleteHackathon(hackathonId);

			if (!result.success) {
				setError(result.error || "ハッカソンの削除に失敗しました");
				setLoading(false);
				return;
			}

			handleClose();
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "ハッカソンの削除に失敗しました",
			);
			setLoading(false);
		}
	};

	if (initialLoading) {
		return (
			<Card className="w-full">
				<div className="text-center py-8">読み込み中...</div>
			</Card>
		);
	}

	return (
		<Card className="w-full">
			<div className="space-y-6">
				{error && (
					<div className="p-4 bg-red bg-opacity-10 border border-red rounded text-red text-sm">
						{error}
					</div>
				)}

				<div className="flex flex-col py-4">
					<p className="text-xl font-bold text-black-primary mb-3">
						{hackathonName}
					</p>
					<p className="text-lg text-black-primary mb-2">
						を削除してもよろしいですか？
					</p>
				</div>

				<div className="flex gap-4">
					<Button
						type="button"
						variant="danger"
						size="lg"
						onClick={handleDelete}
						isLoading={loading}
						fullWidth
					>
						削除
					</Button>
				</div>
			</div>
		</Card>
	);
};
