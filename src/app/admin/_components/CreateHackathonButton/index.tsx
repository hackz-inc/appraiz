"use client";

import { Button } from "@/components/ui";
import { useModalStore } from "@/stores";

export function CreateHackathonButton() {
	const { openModal } = useModalStore();

	return (
		<Button variant="primary" onClick={() => openModal("createHackathon")}>
			➕
		</Button>
	);
}
