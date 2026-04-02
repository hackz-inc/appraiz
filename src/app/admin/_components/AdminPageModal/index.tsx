"use client";

import { useSearchParams } from "next/navigation";
import { InviteGuestModal } from "../InviteGuestModal";

export const AdminPageModal = () => {
	const searchParams = useSearchParams();
	const inviteId = searchParams.get("invite");

	return (
		<>
			{inviteId && <InviteGuestModal hackathonId={inviteId} isOpen={true} />}
		</>
	);
};
