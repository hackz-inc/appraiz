"use client";

import { EditIcon, DeleteIcon } from "@/components/ui/icons";
import { useModalStore } from "@/stores";
import type { Hackathon } from "@/lib/hackathons";
import styles from "./HackathonActionButtons.module.css";

interface HackathonActionButtonsProps {
	hackathon: Hackathon;
}

export function HackathonActionButtons({
	hackathon,
}: HackathonActionButtonsProps) {
	const { openModal } = useModalStore();

	const handleEdit = () => {
		openModal("editHackathon", { data: { hackathon } });
	};

	const handleDelete = () => {
		openModal("deleteHackathon", { data: { hackathon } });
	};

	return (
		<div className={styles.actions}>
			<button
				type="button"
				onClick={handleEdit}
				className={styles.actionButton}
				aria-label="編集"
			>
				<EditIcon size={20} />
			</button>
			<button
				type="button"
				onClick={handleDelete}
				className={styles.actionButton}
				aria-label="削除"
			>
				<DeleteIcon size={20} />
			</button>
		</div>
	);
}
