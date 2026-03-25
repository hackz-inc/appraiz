"use client";

import { Modal } from "@/components/ui";
import { useModalStore } from "@/stores";
import { EditHackathonContent } from "./contents/EditHackathonContent";
import { DeleteHackathonContent } from "./contents/DeleteHackathonContent";
import { CreateHackathonForm } from "./contents/CreateHackathonForm";

export const ModalManager = () => {
	const { isOpen, type, config, closeModal } = useModalStore();

	const getModalContent = () => {
		switch (type) {
			case "createHackathon":
				return <CreateHackathonForm />;
			case "editHackathon":
				return <EditHackathonContent />;
			case "deleteHackathon":
				return <DeleteHackathonContent />;
			// 他のモーダルタイプもここに追加
			default:
				return config.content || null;
		}
	};

	const getModalTitle = () => {
		switch (type) {
			case "createHackathon":
				return "ハッカソン作成";
			case "editHackathon":
				return "ハッカソン編集";
			case "deleteHackathon":
				return "ハッカソン削除";
			default:
				return config.title || "";
		}
	};

	const getModalSize = () => {
		switch (type) {
			case "createHackathon":
				return "lg";
			case "editHackathon":
				return "lg";
			case "deleteHackathon":
				return "md";
			default:
				return config.size || "md";
		}
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={closeModal}
			title={getModalTitle()}
			size={getModalSize()}
		>
			{getModalContent()}
		</Modal>
	);
};
