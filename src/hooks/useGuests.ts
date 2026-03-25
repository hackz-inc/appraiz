import useSWR from "swr";
import { guests, type GuestWithInviteStatus } from "@/lib/guests";

export function useGuests(hackathonId: string) {
	const {
		data: guestsList,
		error,
		isLoading,
		mutate,
	} = useSWR<GuestWithInviteStatus[]>(
		hackathonId ? `guests-${hackathonId}` : null,
		() => guests.getAllWithInviteStatus(hackathonId),
		{
			revalidateOnFocus: false,
			dedupingInterval: 60000,
		}
	);

	return {
		guests: guestsList?.filter((g) => g.isInvited) || [],
		allGuests: guestsList || [],
		isLoading,
		error,
		mutate,
	};
}
