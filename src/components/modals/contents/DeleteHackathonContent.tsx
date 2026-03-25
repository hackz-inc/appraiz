"use client";

import { useState } from "react";
import { Button, Card } from "@/components/ui";
import { useModalStore } from "@/stores";
import { deleteHackathon } from "@/components/features/hackathon/actions";

export const DeleteHackathonContent = () => {
	const { config, closeModal } = useModalStore();
	const hackathonId = config.data?.hackathonId as string;

	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

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
				setError(result.error || "�ë��nJdk1WW~W_");
				setLoading(false);
				return;
			}

			handleClose();
		} catch (err) {
			setError(err instanceof Error ? err.message : "�ë��nJdk1WW~W_");
			setLoading(false);
		}
	};

	return (
		<Card className="w-full">
			<div className="space-y-6">
				{error && (
					<div className="p-4 bg-red bg-opacity-10 border border-red rounded text-red text-sm">
						{error}
					</div>
				)}

				<div className="text-center py-4">
					<p className="text-lg text-black-primary mb-2">,SkJdW~YK</p>
					<p className="text-sm text-black-lighten1">Sn�\o֊�YShLgM~[�</p>
				</div>

				<div className="flex gap-4">
					<Button
						type="button"
						variant="secondary"
						size="lg"
						onClick={handleClose}
						fullWidth
					>
						����
					</Button>
					<Button
						type="button"
						variant="danger"
						size="lg"
						onClick={handleDelete}
						isLoading={loading}
						fullWidth
					>
						Jd
					</Button>
				</div>
			</div>
		</Card>
	);
};
