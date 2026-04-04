import { fetchGuests } from "@/lib/server/guests";
import { InviteGuestModalClient } from "./_components/InviteGuestModalClient";

type Props = {
	searchParams: Promise<{ hackathonId: string }>;
};

export default async function InviteGuestModalPage({ searchParams }: Props) {
	const { hackathonId } = await searchParams;

	if (!hackathonId) {
		return null;
	}

	const guestList = await fetchGuests();

	return (
		<InviteGuestModalClient hackathonId={hackathonId} guestList={guestList} />
	);
}
