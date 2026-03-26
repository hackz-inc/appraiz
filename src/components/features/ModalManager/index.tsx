"use client";

import {
	CreateHackathonModal,
	EditHackathonModal,
	DeleteHackathonModal,
} from "@/components/features/hackathon";

export function ModalManager() {
	return (
		<>
			{/* Hackathon Modals */}
			<CreateHackathonModal />
			<EditHackathonModal />
			<DeleteHackathonModal />

			{/* TODO: Add Team Modals */}
			{/* TODO: Add Scoring Item Modals */}
		</>
	);
}
