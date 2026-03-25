"use client";

import { EditIcon, DeleteIcon } from "@/components/ui/icons";
import { useModalStore } from "@/stores";
import styles from "./HackathonActionButtons.module.css";

interface HackathonActionButtonsProps {
	hackathonId: string;
}

export function HackathonActionButtons({
	hackathonId,
}: HackathonActionButtonsProps) {
	const { openModal } = useModalStore();

	const handleEdit = () => {
		openModal("editHackathon", { data: { hackathonId } });
	};

	const handleDelete = () => {
		openModal("deleteHackathon", { data: { hackathonId } });
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
