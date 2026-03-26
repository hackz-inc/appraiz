import { getHackathonById } from "@/lib/server/hackathons";
import { getTeamsByHackathon } from "@/lib/server/teams";
import { getScoringItemsByHackathon } from "@/lib/server/scoring";
import { getInvitedGuests } from "@/lib/server/guests";
import { HackathonDetailClient } from "./_components/HackathonDetailClient";
import { notFound } from "next/navigation";

export default async function HackathonDetailPage({
	params,
}: {
	params: Promise<{ id: string }>;
	searchParams: Promise<{ tab?: string }>;
}) {
	const resolvedParams = await params;
	const hackathonId = resolvedParams.id;

	try {
		const [hackathon, teams, scoringItems, guests] = await Promise.all([
			getHackathonById(hackathonId),
			getTeamsByHackathon(hackathonId),
			getScoringItemsByHackathon(hackathonId),
			getInvitedGuests(hackathonId),
		]);

		return (
			<HackathonDetailClient
				hackathon={hackathon}
				teams={teams}
				scoringItems={scoringItems}
				guests={guests}
			/>
		);
	} catch (error) {
		console.error("Error loading hackathon:", error);
		notFound();
	}
}
