"use client";

import { EditIcon, DeleteIcon } from "@/components/ui/icons";
import { useModalStore } from "@/stores";
import type { Hackathon } from "@/lib/hackathons";
import { HandShakeIcon } from "@/components/ui/icons/HandShakeIcon";

type Props = {
	hackathon: Hackathon;
};

export const HackathonActionButtons = ({ hackathon }: Props) => {
	const { openModal } = useModalStore();

	const handleHandshake = () => {
		openModal("handshakeHackathon", { data: { hackathon } });
	};

	const handleEdit = () => {
		openModal("editHackathon", { data: { hackathon } });
	};

	const handleDelete = () => {
		openModal("deleteHackathon", { data: { hackathon } });
	};

	return (
		<div className="flex gap-2">
			<button
				type="button"
				onClick={handleEdit}
				className="inline-flex items-center justify-center w-9 h-9 rounded-lg border-none bg-transparent text-black-lighten1 cursor-pointer transition-all hover:bg-black-lighten4 hover:text-black active:scale-95"
				aria-label="ゲスト"
			>
				<HandShakeIcon size={20} />
			</button>
			<button
				type="button"
				onClick={handleEdit}
				className="inline-flex items-center justify-center w-9 h-9 rounded-lg border-none bg-transparent text-black-lighten1 cursor-pointer transition-all hover:bg-black-lighten4 hover:text-black active:scale-95"
				aria-label="編集"
			>
				<EditIcon size={20} />
			</button>
			<button
				type="button"
				onClick={handleDelete}
				className="inline-flex items-center justify-center w-9 h-9 rounded-lg border-none bg-transparent text-black-lighten1 cursor-pointer transition-all hover:bg-black-lighten4 hover:text-black active:scale-95"
				aria-label="削除"
			>
				<DeleteIcon size={20} />
			</button>
		</div>
	);
};
