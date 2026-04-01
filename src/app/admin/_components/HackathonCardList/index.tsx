import { fetchHackathons } from "@/lib/server/hackathons";
import { HackathonCard } from "../HackathonCard";

export async function HackathonCardList() {
	const data = await fetchHackathons();

	if (!data || data.length === 0) {
		return <div>データがありません。</div>;
	}

	return (
		<ul className="flex flex-col gap-6 list-none m-0 p-0">
			{data.map((hackathon) => (
				<li key={hackathon.id}>
					<HackathonCard hackathon={hackathon} />
				</li>
			))}
		</ul>
	);
}
