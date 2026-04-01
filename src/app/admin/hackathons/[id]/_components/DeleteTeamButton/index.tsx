"use client";

import { Button } from "@/components/ui";
import { teams } from "@/lib/teams";

export const DeleteTeamButton = ({
	teamId,
}: {
	teamId: string;
	hackathonId: string;
}) => {
	const handleDelete = async () => {
		if (!confirm("このチームを削除しますか？")) return;

		try {
			await teams.delete(teamId);
		} catch (error) {
			console.error("Failed to delete team:", error);
			alert("チームの削除に失敗しました");
		}
	};

	return (
		<Button variant="danger" size="sm" onClick={handleDelete}>
			🗑️ 削除
		</Button>
	);
};
